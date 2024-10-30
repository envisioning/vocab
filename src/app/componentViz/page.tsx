// file path: /Users/kemi/Documents/GitHub/vocab/src/app/componentViz/page.tsx

'use client'

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader } from 'lucide-react';

// Types
interface ComponentInfo {
    name: string;
    path: string;
}

interface LoadedComponent {
    name: string;
    Component: React.ComponentType;
}

// Helper to format component name
const formatComponentName = (path: string): string => {
    const name = path.split('/').pop()?.replace(/\.tsx$/, '') || '';
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Loading placeholder component
const ComponentSkeleton = ({ name }: { name: string }) => (
    <div className="h-64 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Loading {name}...</p>
            </div>
        </div>
    </div>
);

// Error message component
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {message}
    </div>
);

const ComponentVizPage = () => {
    const [components, setComponents] = useState<LoadedComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadComponents = async () => {
            try {
                setError(null);

                // Mock component paths - replace with actual component discovery logic
                const componentPaths = [
                    '/Users/kemi/Documents/GitHub/vocab/src/components/articles/1-ok/adversarial-debiasing.tsx',
                    '@/components/articles/1-ok/ai-winter',
                    '@/components/articles/2-adjust/ai-governance',
                ];

                const loadedComponents = await Promise.all(
                    componentPaths.map(async (path) => {
                        const name = formatComponentName(path);
                        
                        // Create wrapper component to handle dynamic import
                        const DynamicComponent = dynamic(
                            () => import(path).catch(err => {
                                console.error(`Failed to load component ${name}:`, err);
                                return () => (
                                    <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                                        Failed to load component: {name}
                                    </div>
                                );
                            }),
                            {
                                loading: () => <ComponentSkeleton name={name} />,
                            }
                        );

                        return {
                            name,
                            Component: DynamicComponent
                        };
                    })
                );

                setComponents(loadedComponents);
            } catch (err) {
                console.error('Error loading components:', err);
                setError('Failed to load components. Please check the console for details.');
            } finally {
                setLoading(false);
            }
        };

        loadComponents();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((n) => (
                        <ComponentSkeleton key={n} name="Component" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Component Library</h1>
                <p className="text-gray-600">
                    Displaying {components.length} components from the articles directory
                </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {components.map(({ name, Component }) => (
                    <div key={name} className="rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">{name}</h2>
                        <div className="relative">
                            <Suspense fallback={<ComponentSkeleton name={name} />}>
                                <Component />
                            </Suspense>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComponentVizPage;