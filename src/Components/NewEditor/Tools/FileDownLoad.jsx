import React from "react";
import { IoMdDownload } from "react-icons/io";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import imageCompression from "browser-image-compression";

const FileDownLoad = ({ editorRef }) => {
  const downloadPdf = async () => {
    if (!editorRef.current) return;
  
    // Temporarily modify CSS to ensure content is visible
    const originalStyles = {
      overflow: editorRef.current.style.overflow,
      height: editorRef.current.style.height,
    };
    editorRef.current.style.overflow = "visible";
    editorRef.current.style.height = "auto";
  
    // Capture content with html2canvas (reduce scale for smaller size)
    const canvas = await html2canvas(editorRef.current, {
      scale: 1.5, // Reduced scale for smaller image size
      useCORS: true,
      logging: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
    });
  
    // Initialize the PDF object
    const pdf = new jsPDF("p", "mm", "a4");
  
    // Calculate dimensions and number of pages
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
  
    const margin = 10; // Margin in mm
    const innerPageHeight = pageHeight - margin * 2;
    const pxFullHeight = canvas.height;
    const pxPageHeight = Math.floor(canvas.width * (innerPageHeight / imgWidth));
    const nPages = Math.ceil(pxFullHeight / pxPageHeight);
  
    // Convert canvas to image (JPEG with 80% quality)
    const imgData = canvas.toDataURL("image/jpeg", 0.8);
  
    // Convert base64 to Blob
    const blob = await fetch(imgData).then((res) => res.blob());
  
    // Estimate a reasonable maxSizeMB based on the number of pages
    const maxSizeMB = Math.max(1, nPages * 0.5); // Allow 0.5 MB per page, minimum 1 MB
  
    // Compress the image
    const compressedBlob = await imageCompression(blob, {
      maxSizeMB, // Dynamic max size based on the number of pages
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true, // Use web worker for better performance
    });
  
    // Convert compressed Blob back to base64
    const compressedImgData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(compressedBlob);
    });
  
    for (let page = 0; page < nPages; page++) {
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pxPageHeight;
  
      // Draw the current page slice
      pageCtx.fillStyle = "white";
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      pageCtx.drawImage(
        canvas,
        0,
        page * pxPageHeight,
        canvas.width,
        pxPageHeight,
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );
  
      const imgData = pageCanvas.toDataURL("image/jpeg", 0.8); // Use JPEG with 80% quality
      if (page > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", margin, margin, imgWidth - margin * 2, innerPageHeight);
    }
  
    // Save the PDF
    pdf.save("document.pdf");
  
    // Restore original styles
    editorRef.current.style.overflow = originalStyles.overflow;
    editorRef.current.style.height = originalStyles.height;
  };
  
  return (
    <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-sm">
      <button
        title="Download"
        className="p-2 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-200"
        onClick={downloadPdf}
      >
        <IoMdDownload size={16} />
      </button>
    </div>
  );
};

export default FileDownLoad;