import { useState, useEffect } from 'react';
import { Search, Filter, Compass } from 'lucide-react';
import { getAllSimulations, getSimulationTypes, type Simulation, type SimulationCategory } from '../services/simulationService';
import SimulationCard from '../components/explore/SimulationCard';

const SimulationExplorer = () => {
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [categories, setCategories] = useState<SimulationCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch simulations first as they are critical
                try {
                    const sims = await getAllSimulations();
                    console.log("Fetched simulations:", sims); // Debug log
                    setSimulations(sims);
                } catch (simError) {
                    console.error("Failed to fetch simulations", simError);
                }

                // Fetch categories separately so failure doesn't block simulations
                try {
                    const types = await getSimulationTypes();
                    if (types && types.length > 0) {
                        setCategories(types);
                    } else {
                        // Fallback if API returns empty but we know data should exist
                        console.warn("API returned no categories, using fallback.");
                        setCategories([
                            { id: 1, name: 'Operating Systems', shortName: 'OS', color: '#4F46E5' },
                            { id: 2, name: 'Algorithms', shortName: 'ALGO', color: '#16A34A' }
                        ]);
                    }
                } catch (typeError) {
                    console.error("Failed to fetch simulation types", typeError);
                    // Use fallback on error
                    setCategories([
                        { id: 1, name: 'Operating Systems', shortName: 'OS', color: '#4F46E5' },
                        { id: 2, name: 'Algorithms', shortName: 'ALGO', color: '#16A34A' }
                    ]);
                }
            } catch (error) {
                console.error("Unexpected error during fetch", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredSimulations = simulations.filter(sim => {
        // Updated filtering logic for new schema: sim.type is now an object
        // We filter by checking if selectedCategory (string name) matches sim.type.name
        const matchesCategory = selectedCategory === 'All' || (sim.type && sim.type.name === selectedCategory);
        const matchesSearch = sim.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 pt-12 pb-8 px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 opacity-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 flex items-center gap-3">
                        <Compass className="w-10 h-10 text-primary" />
                        Explore Simulations
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        Choose a system or algorithm and experiment with it interactively.
                        Understand complex concepts by seeing them run.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">

                {/* Sticky Filters */}
                <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm py-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-transparent">

                    {/* Category Pills */}
                    <div className="flex items-center gap-2 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto max-w-full">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${selectedCategory === 'All'
                                ? 'bg-primary text-white shadow-md transform scale-105'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${selectedCategory === cat.name
                                    ? 'shadow-md transform scale-105'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                style={selectedCategory === cat.name ? { backgroundColor: cat.color, color: 'white' } : {}}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm shadow-sm"
                            placeholder="Search simulations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse shadow-sm">
                                <div className="h-40 bg-slate-100 rounded-t-xl" />
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-slate-100 rounded w-3/4" />
                                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSimulations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {filteredSimulations.map((sim) => (
                            <SimulationCard key={sim.id} simulation={sim} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Filter className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No simulations found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationExplorer;
