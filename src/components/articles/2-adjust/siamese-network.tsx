"use client"
import { useState, useEffect } from "react";
import { Image, Fingerprint, ArrowRight, Shuffle, RefreshCw } from "lucide-react";

interface ComponentProps {}

type ImageType = "face" | "fingerprint" | "signature";
type NetworkState = "idle" | "processing" | "complete";

const IMAGES: Record<ImageType, string[]> = {
  face: ["👨", "👩", "👴", "👵"],
  fingerprint: ["🖐️", "👋", "✋", "🤚"],
  signature: ["✍️", "✒️", "🖋️", "📝"],
};

/**
 * SiameseNetworkPlayground: An interactive component to teach Siamese Networks
 * to 15-18 year old students through visual representation and interaction.
 */
const SiameseNetworkPlayground: React.FC<ComponentProps> = () => {
  const [imageType, setImageType] = useState<ImageType>("face");
  const [input1, setInput1] = useState<string>(IMAGES[imageType][0]);
  const [input2, setInput2] = useState<string>(IMAGES[imageType][1]);
  const [networkState, setNetworkState] = useState<NetworkState>("idle");
  const [similarity, setSimilarity] = useState<number>(0);

  useEffect(() => {
    if (networkState === "processing") {
      const timer = setTimeout(() => {
        setNetworkState("complete");
        setSimilarity(Math.random());
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [networkState]);

  const handleImageTypeChange = (type: ImageType) => {
    setImageType(type);
    setInput1(IMAGES[type][0]);
    setInput2(IMAGES[type][1]);
    setNetworkState("idle");
    setSimilarity(0);
  };

  const handleInputChange = (inputNum: 1 | 2) => {
    const currentImages = IMAGES[imageType];
    const newImage = currentImages[(currentImages.indexOf(inputNum === 1 ? input1 : input2) + 1) % currentImages.length];
    inputNum === 1 ? setInput1(newImage) : setInput2(newImage);
    setNetworkState("idle");
    setSimilarity(0);
  };

  const handleProcess = () => {
    setNetworkState("processing");
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Siamese Network Playground</h2>
      
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleImageTypeChange("face")}
          className={`p-2 rounded ${imageType === "face" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          aria-label="Select face images"
        >
          <Image className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleImageTypeChange("fingerprint")}
          className={`p-2 rounded ${imageType === "fingerprint" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          aria-label="Select fingerprint images"
        >
          <Fingerprint className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleImageTypeChange("signature")}
          className={`p-2 rounded ${imageType === "signature" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          aria-label="Select signature images"
        >
          ✍️
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="text-6xl cursor-pointer" onClick={() => handleInputChange(1)} role="button" tabIndex={0} aria-label="Change first input">
          {input1}
        </div>
        <ArrowRight className="w-6 h-6" />
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
          {networkState === "processing" && <RefreshCw className="w-8 h-8 animate-spin" />}
          {networkState === "complete" && <div className="text-xl font-bold">{similarity.toFixed(2)}</div>}
        </div>
        <ArrowRight className="w-6 h-6" />
        <div className="text-6xl cursor-pointer" onClick={() => handleInputChange(2)} role="button" tabIndex={0} aria-label="Change second input">
          {input2}
        </div>
      </div>

      <button
        onClick={handleProcess}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        disabled={networkState === "processing"}
      >
        {networkState === "idle" ? "Process" : networkState === "processing" ? "Processing..." : "Process Again"}
      </button>

      {networkState === "complete" && (
        <p className="mt-4 text-center">
          The Siamese Network determined that these inputs are{" "}
          <span className="font-bold">{similarity > 0.5 ? "similar" : "different"}</span>.
          <br />
          This demonstrates how Siamese Networks can compare and measure similarity between inputs.
        </p>
      )}
    </div>
  );
};

export default SiameseNetworkPlayground;