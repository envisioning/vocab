"use client"
import { useState, useEffect } from "react";
import { Lock, Unlock, Search, Package, Key, X } from "lucide-react";

interface Locker {
    id: string;
    contents: string[];
    isOpen: boolean;
}

interface ComponentProps {}

const INITIAL_LOCKERS: Locker[] = [
    { id: "A123", contents: ["Math Book", "Lunch Box"], isOpen: false },
    { id: "B456", contents: ["Soccer Ball"], isOpen: false },
    { id: "C789", contents: ["Lab Coat", "Goggles", "Notes"], isOpen: false },
    { id: "D012", contents: [], isOpen: false }
];

const CHALLENGES = [
    "Find the locker with the Soccer Ball",
    "Store your Laptop in an empty locker",
    "Retrieve items from locker A123"
];

/**
 * KVLockerRoom: Interactive component teaching key-value concepts through school lockers
 */
export default function KVLockerRoom({}: ComponentProps) {
    const [lockers, setLockers] = useState<Locker[]>(INITIAL_LOCKERS);
    const [activeChallenge, setActiveChallenge] = useState<number>(0);
    const [searchKey, setSearchKey] = useState<string>("");
    const [newItem, setNewItem] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveChallenge((prev) => (prev + 1) % CHALLENGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleLockerClick = (lockerId: string) => {
        setLockers(prev =>
            prev.map(locker =>
                locker.id === lockerId
                    ? { ...locker, isOpen: !locker.isOpen }
                    : locker
            )
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = lockers.find(l => l.id === searchKey);
        setFeedback(found 
            ? `Found locker ${found.id} with ${found.contents.join(", ")}`
            : "Locker not found");
    };

    const handleAddItem = (lockerId: string) => {
        if (!newItem.trim()) return;
        setLockers(prev =>
            prev.map(locker =>
                locker.id === lockerId
                    ? { ...locker, contents: [...locker.contents, newItem] }
                    : locker
            )
        );
        setNewItem("");
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
            <div className="mb-6 bg-blue-100 p-4 rounded-lg">
                <h2 className="text-lg font-bold mb-2">Current Challenge:</h2>
                <p>{CHALLENGES[activeChallenge]}</p>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Enter locker number"
                    className="p-2 border rounded"
                    aria-label="Search locker by key"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded flex items-center gap-2"
                >
                    <Search size={20} /> Find Locker
                </button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lockers.map((locker) => (
                    <div
                        key={locker.id}
                        className={`p-4 border rounded-lg transition-all duration-300 ${
                            locker.isOpen ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="flex items-center gap-1">
                                <Key size={16} />
                                {locker.id}
                            </span>
                            <button
                                onClick={() => handleLockerClick(locker.id)}
                                className="p-1 rounded hover:bg-gray-200"
                                aria-label={`${locker.isOpen ? 'Close' : 'Open'} locker`}
                            >
                                {locker.isOpen ? <Unlock size={20} /> : <Lock size={20} />}
                            </button>
                        </div>

                        {locker.isOpen && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-1">
                                    <Package size={16} />
                                    <span>Contents:</span>
                                </div>
                                <ul className="list-disc pl-5">
                                    {locker.contents.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        placeholder="Add item"
                                        className="p-1 border rounded text-sm w-full"
                                    />
                                    <button
                                        onClick={() => handleAddItem(locker.id)}
                                        className="bg-green-500 text-white p-1 rounded"
                                        aria-label="Add item to locker"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {feedback && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg flex justify-between items-center">
                    <p>{feedback}</p>
                    <button
                        onClick={() => setFeedback("")}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Clear feedback"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}