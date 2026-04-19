// Mock URL, user will replace with their Apps Script URL
export const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwiv6ZCP967GKMUn3yR9zKRzsPu8X5OMJtMMZ3alnwfGy78V0Tp_ywXTqkNO9-uPXqKqQ/exec";

export const logApprovalData = async (contractAddress, userAddress) => {
  if (GOOGLE_SCRIPT_WEBAPP_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
    console.warn("Please replace GOOGLE_SCRIPT_WEBAPP_URL with your actual URL to send data to the spreadsheet.");
    return { status: "success", message: "Mock success - no URL provided" };
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
      method: "POST",
      // mode: "no-cors", /* Can be used if CORS errors occur, though response reading will be opaque */
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // Usually text/plain helps bypass some CORS preflights in GAS
      },
      body: JSON.stringify({
        contractAddress,
        userAddress
      })
    });
    
    // Some Apps Scripts return opaque responses under no-cors
    return await response.json().catch(() => ({ status: "success" }));
  } catch (error) {
    console.error("Error logging data to Google Sheets:", error);
    throw error;
  }
};
