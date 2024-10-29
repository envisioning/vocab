"use client";

import { useState, useEffect } from "react";
import { Trees, ChevronDown, ChevronRight, Code } from "lucide-react";

interface Props {}

interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}

const ASTExplainer: React.FC<Props> = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const sampleAST: TreeNode = {
    id: "root",
    label: "Program",
    children: [
      {
        id: "func",
        label: "Function",
        children: [
          {
            id: "params",
            label: "Parameters",
            children: []
          },
          {
            id: "body",
            label: "Body",
            children: [
              {
                id: "return",
                label: "Return",
                children: [
                  {
                    id: "value",
                    label: "Value",
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="ml-4">
        <div
          className={`flex items-center p-2 cursor-pointer rounded hover:bg-gray-100 
            ${isSelected ? 'bg-blue-100' : ''}`}
          onClick={() => toggleNode(node.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleNode(node.id);
            }
          }}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`Tree node ${node.label}`}
        >
          {node.children.length > 0 && (
            <span className="mr-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          <Trees className="w-4 h-4 mr-2 text-blue-600" />
          <span>{node.label}</span>
        </div>
        
        {isExpanded && node.children.length > 0 && (
          <div className="border-l-2 border-gray-200">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Code className="w-6 h-6 mr-2 text-blue-600" />
          Abstract Syntax Tree Explorer
        </h1>
        <p className="text-gray-600 mb-4">
          Explore how computers break down code into a tree structure. Click nodes to expand/collapse.
        </p>
      </div>

      <div 
        className="border rounded-lg p-4 bg-white shadow-sm"
        role="tree"
        aria-label="Abstract Syntax Tree visualization"
      >
        {renderNode(sampleAST)}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg" role="complementary">
        <h2 className="text-lg font-semibold mb-2">What is an AST?</h2>
        <p className="text-gray-700">
          An Abstract Syntax Tree (AST) represents the structure of code in a tree format.
          Each node represents a construct in the code, showing how different parts relate to each other.
        </p>
      </div>
    </div>
  );
};

export default ASTExplainer;
