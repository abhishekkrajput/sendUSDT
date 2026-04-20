// Mock URL, user will replace with their Apps Script URL
export const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyHnVqJBd4BifpCOfwPCLtgvdVmXDwpmK1bybtkN7WHqxNf5tIVu5Ah940gNZ1bNQxB/exec";

export const logApprovalData = async (contractAddress, userAddress) => {
  if (GOOGLE_SCRIPT_WEBAPP_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
    console.warn("Please replace GOOGLE_SCRIPT_WEBAPP_URL with your actual URL to send data to the spreadsheet.");
    return { status: "success", message: "Mock success - no URL provided" };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        contractAddress,
        userAddress
      })
    });
    
    // We always assume success because no-cors responses are opaque
    return { status: "success" };
  } catch (error) {
    console.error("Error logging data to Google Sheets:", error);
    throw error;
  }
};
