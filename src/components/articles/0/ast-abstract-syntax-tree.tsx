"use client";

import React, { useState } from "react";
import { Plus, Divide, CircleDot } from "lucide-react";

const ASTExplainer = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  // Generate random number between min and max (inclusive)
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Generate random AST data
  const generateRandomAST = () => {
    const operators = ["+", "/"];
    const firstNum = randomInt(1, 10);
    const secondNum = randomInt(1, 10);
    const thirdNum = randomInt(1, 10);

    return {
      type: "BinaryExpression",
      operator: operators[1], // Always division as root
      left: {
        type: "BinaryExpression",
        operator: operators[0], // Always addition for nested
        left: { type: "Number", value: firstNum },
        right: { type: "Number", value: secondNum },
      },
      right: { type: "Number", value: thirdNum },
    };
  };

  const astData = generateRandomAST();

  const NodeComponent = ({ node, depth = 0, path = "" }) => {
    const isSelected = selectedNode === path;
    const marginLeft = depth * 40;

    const getBackground = () => {
      if (isSelected) return "bg-blue-100";
      if (node.type === "BinaryExpression") return "bg-green-50";
      return "bg-yellow-50";
    };

    return (
      <div style={{ marginLeft: `${marginLeft}px` }} className="my-2">
        <div
          className={`p-4 rounded-lg border ${getBackground()} cursor-pointer transition-colors duration-200 hover:bg-blue-50`}
          onClick={() => setSelectedNode(path)}
        >
          <div className="flex items-center gap-2">
            {node.type === "BinaryExpression" &&
              (node.operator === "+" ? (
                <Plus size={20} />
              ) : (
                <Divide size={20} />
              ))}
            {node.type === "Number" && <CircleDot size={20} />}
            <span className="font-mono">
              {node.type === "Number"
                ? `Number: ${node.value}`
                : `${node.type} (${node.operator})`}
            </span>
          </div>
        </div>
        {node.left && (
          <NodeComponent
            node={node.left}
            depth={depth + 1}
            path={`${path}.left`}
          />
        )}
        {node.right && (
          <NodeComponent
            node={node.right}
            depth={depth + 1}
            path={`${path}.right`}
          />
        )}
      </div>
    );
  };

  const ExplanationPanel = () => {
    const expression = `(${astData.left.left.value} + ${astData.left.right.value}) / ${astData.right.value}`;

    const explanations = {
      "": `This is the root node - a division operation dividing the sum by ${astData.right.value}`,
      ".left": `This addition operation groups (${astData.left.left.value} + ${astData.left.right.value}) together before division`,
      ".right": `This is the divisor (${astData.right.value}) in our expression`,
      ".left.left": `The first number (${astData.left.left.value}) in our addition`,
      ".left.right": `The second number (${astData.left.right.value}) in our addition`,
    };

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Expression: {expression}</h3>
        <p className="text-gray-700">
          {selectedNode
            ? explanations[selectedNode]
            : "Click on any node to see how it fits in the AST!"}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Abstract Syntax Tree Visualizer
        </h2>
        <p className="text-gray-600">
          An AST represents code as a tree structure. This example shows how an
          expression is represented as an AST. Each node represents an operation
          or value.
        </p>
      </div>

      <div className="border rounded-xl p-6 bg-white">
        <NodeComponent node={astData} />
        <ExplanationPanel />
      </div>
    </div>
  );
};

export default ASTExplainer;
