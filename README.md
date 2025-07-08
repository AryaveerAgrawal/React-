import { useState, useCallback } from "react";
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  X
} from "lucide-react";

// Custom toast hook
function useSimpleToast() {
  const [toasts, setToasts] = useState([]);
  
  const show = useCallback((msg, variant = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);
  
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow-lg ${
            t.variant === "error"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
  
  return { show, ToastContainer };
}

// UI Components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled = false, variant = "primary", className = "" }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

const Alert = ({ children, variant = "info" }) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };
  
  return (
    <div className={`p-4 rounded-md border flex items-start gap-2 ${variants[variant]}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);

// Mock API function for demo
const mockProcessLicense = async (file) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data
  return {
    data: {
      state: "CA",
      dlNumber: "D1234567",
      issueDate: "01/15/2020",
      expiryDate: "01/15/2025",
      name: "JOHN DOE",
      address: "123 MAIN ST, ANYTOWN, CA 90210",
      sex: "M",
      height: "5-10",
      weight: "170",
      dob: "01/01/1990",
      restrictions: "CORRECTIVE LENSES",
      hair: "BRN",
      eye: "BRN",
      dd: "01234567890123456789",
      endorsements: "NONE"
    }
  };
};

export default function SingleDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const { show, ToastContainer } = useSimpleToast();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  }, []);

  const processFiles = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    
    if (!f.type.startsWith('image/')) {
      show("Please select an image file", "error");
      return;
    }
    
    if (f.size > 10 * 1024 * 1024) {
      show("File size must be less than 10MB", "error");
      return;
    }
    
    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setShowResults(false);
    setExtractedData(null);
  }, [show]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    try {
      const result = await mockProcessLicense(selectedFile);
      setExtractedData(result.data);
      setShowResults(true);
      setTimeout(() => {
        const element = document.getElementById("results-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
      show("Driver's license processed successfully!", "success");
    } catch (error) {
      show("Processing failed. Try a clearer image.", "error");
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, show]);

  const handleClear = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setShowResults(false);
    setIsProcessing(false);
  }, [previewUrl]);

  const licenseFields = [
    { key: "state", label: "State" },
    { key: "dlNumber", label: "DL Number" },
    { key: "issueDate", label: "Issue Date" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "sex", label: "Sex" },
    { key: "height", label: "Height" },
    { key: "weight", label: "Weight" },
    { key: "dob", label: "DOB" },
    { key: "restrictions", label: "Restrictions" },
    { key: "hair", label: "Hair" },
    { key: "eye", label: "Eye" },
    { key: "dd", label: "DD" },
    { key: "endorsements", label: "END" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer />

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CreditCard className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Driver's License Processor
          </h1>
          <p className="text-gray-600">
            Upload a photo of your driver's license to extract information
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {!selectedFile ? (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your license image here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
                  >
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg shadow-md"
                    />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      variant="primary"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Process License
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleClear}
                      variant="secondary"
                      disabled={isProcessing}
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && extractedData && (
          <Card id="results-section">
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Extracted Information
                </h2>
                <Badge variant="success">Success</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {licenseFields.map((field) => (
                  <div key={field.key} className="border rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                    <div className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                      {extractedData[field.key] || "Not detected"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button onClick={handleClear} variant="secondary" className="w-full">
                  Process Another License
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Alert */}
        <Alert variant="info">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <AlertDescription>
            <strong>Privacy Notice:</strong> This is a demo application. In a real implementation,
            ensure all uploaded images are processed securely and not stored permanently.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}
