import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Play, BookOpen, Layers, Cpu, Server, Activity, Users, GraduationCap, Code2, ArrowRight, Settings, Sliders } from 'lucide-react';
import { getUserDashboard, type DashboardSimulation } from '../services/simulationService';
import MockSimulation from '../components/landing/MockSimulation';
import FeatureCard from '../components/landing/FeatureCard';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [recentSimulations, setRecentSimulations] = useState<DashboardSimulation[]>([]);
    const [totalRuns, setTotalRuns] = useState(0);

    useEffect(() => {
        if (user) {
            getUserDashboard().then(data => {
                // Sort by last run time to show most recent
                const sorted = [...data].sort((a, b) => {
                    const timeA = a.lastRunAt ? new Date(a.lastRunAt).getTime() : 0;
                    const timeB = b.lastRunAt ? new Date(b.lastRunAt).getTime() : 0;
                    return timeB - timeA;
                });
                setRecentSimulations(sorted.slice(0, 2));
                setTotalRuns(data.reduce((acc, curr) => acc + curr.runsCount, 0));
            }).catch(err => console.error("Failed to fetch dashboard preview", err));
        }
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen font-sans">

            {/* HERO SECTION */}
            <section className="relative pt-20 pb-32 bg-gradient-to-b from-blue-50/80 to-white overflow-hidden border-b border-slate-200">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
                    {/* Hero Text */}
                    <div className="flex-1 text-center lg:text-left z-10">
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1] drop-shadow-sm">
                            Learn Systems by <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Seeing Them Run</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed shadow-slate-100">
                            Interactive simulations for Operating Systems and Algorithms.
                            Control execution, tweak parameters, and understand what really happens inside.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/explore" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg border border-transparent">
                                <Play className="w-5 h-5 fill-current" /> Start Simulating
                            </Link>
                            {!user && (
                                <Link to="/register" className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center text-lg shadow-sm hover:shadow-md">
                                    Create Free Account
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none perspective-1000">
                        <MockSimulation />
                    </div>
                </div>
            </section>

            {/* SECTION 2: Why SimuLab? (Pain vs Solution) */}
            <section className="py-24 bg-white relative z-10 shadow-xl shadow-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why SimuLab?</h2>
                        <p className="text-slate-500 mt-4 text-lg">PDFs don't explain processes. We do.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                                <BookOpen className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Static Learning</h3>
                            <p className="text-slate-600">Textbooks and slides only show final answers, missing the dynamic process that actually matters.</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden shadow-lg transform md:-translate-y-2">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Settings className="w-24 h-24" />
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 relative z-10 shadow-sm">
                                <Sliders className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-900 mb-3 relative z-10">Use SimuLab</h3>
                            <p className="text-slate-700 relative z-10">Step-by-step execution. Pause, rewind, and inspect every state change as it happens.</p>
                        </div>

                        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                                <Activity className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-900 mb-3">True Understanding</h3>
                            <p className="text-emerald-800">See queues, memory, and execution evolve live. Grasp complex concepts intuitively.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Featured Simulations */}
            <section className="py-24 bg-slate-100 shadow-inner border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Featured Simulations</h2>
                            <p className="text-slate-500 mt-2">Core OS and Algorithm concepts visualized.</p>
                        </div>
                        <Link to="/explore" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                            Explore All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Cpu}
                            title="CPU Scheduling"
                            description="Visualize how the OS picks which process to run next using various algorithms."
                            details={['FCFS, SJF, Round Robin', 'Control arrival & burst times', 'Gantt Chart visualization']}
                            color="blue"
                            onClick={() => navigate('/explore')}
                        />
                        <FeatureCard
                            icon={Layers}
                            title="Deadlock Detection"
                            description="Understand resource allocation graphs and how systems detect and recover from deadlocks."
                            details={['Resource Allocation Graph', 'Wait-for Graph', 'Cycle Detection']}
                            color="purple"
                            onClick={() => navigate('/explore')}
                        />
                        <FeatureCard
                            icon={Server}
                            title="Page Replacement"
                            description="See how memory management units swap pages in and out of physical memory."
                            details={['FIFO, LRU, Optimal', 'Page Fault visualization', 'Reference plotting']}
                            color="emerald"
                            onClick={() => navigate('/explore')}
                        />
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/explore" className="inline-flex items-center gap-2 text-primary font-semibold">
                            Explore All Simulations <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 4: How It Works */}
            <section className="py-24 bg-white relative z-10 shadow-2xl shadow-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
                        <p className="text-slate-500 mt-2">Mastering systems in 3 simple steps.</p>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-12 text-center">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-slate-200 via-primary/20 to-slate-200 -z-10" />

                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-3xl font-bold text-primary shadow-xl shadow-blue-900/5 mb-6 z-10 relative hover:scale-110 transition-transform duration-300">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Choose Module</h3>
                            <p className="text-slate-500">Select from Operating Systems or Algorithms libraries depending on what you're studying.</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-3xl font-bold text-primary shadow-xl shadow-blue-900/5 mb-6 z-10 relative hover:scale-110 transition-transform duration-300">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Set Parameters</h3>
                            <p className="text-slate-500">Input your own values: arrival times, priorities, graph edges, or memory limits.</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-3xl font-bold text-primary shadow-xl shadow-blue-900/5 mb-6 z-10 relative hover:scale-110 transition-transform duration-300">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Run & Control</h3>
                            <p className="text-slate-500">Watch it run. Pause, step forward/back, and instantly see the effect of your changes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: Who Is This For? */}
            <section className="py-24 bg-slate-900 text-white shadow-inner relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f4f4f_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold">Who is SimuLab for?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-lg hover:shadow-primary/10 hover:border-slate-600 transition-all">
                            <Code2 className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">CSE Students</h3>
                            <p className="text-slate-300">Understand OS & algorithms deeply to ace your exams and interviews.</p>
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-lg hover:shadow-purple-500/10 hover:border-slate-600 transition-all">
                            <Users className="w-10 h-10 text-purple-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Teachers</h3>
                            <p className="text-slate-300">Use visual demos in the classroom to explain complex concepts effortlessly.</p>
                        </div>
                        <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 shadow-lg hover:shadow-emerald-500/10 hover:border-slate-600 transition-all">
                            <GraduationCap className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Self Learners</h3>
                            <p className="text-slate-300">Stop memorizing theories. Build intuition by experimenting with dynamic systems.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6: Preview Dashboard (Trust Builder) */}
            {user && (
                <section className="py-20 bg-blue-50/50 border-y border-blue-100 shadow-inner">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <p className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Welcome Back, {user.name}</p>
                        <h2 className="text-3xl font-bold text-slate-900 mb-8">Continue your learning</h2>

                        <div className="bg-white p-6 rounded-2xl shadow-2xl border border-blue-100 flex flex-col md:flex-row items-center gap-8 text-left">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Recent Progress</h3>
                                {recentSimulations.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentSimulations.map((sim, idx) => {
                                            const progress = sim.completed ? 100 : Math.min(sim.runsCount * 10, 90);
                                            const colorClass = idx === 0 ? "bg-primary" : "bg-orange-400";
                                            const shadowClass = idx === 0 ? "shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "shadow-[0_0_10px_rgba(251,146,60,0.5)]";

                                            return (
                                                <div key={sim.slug}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>{sim.simulation}</span>
                                                        <span className="font-bold text-slate-700">{progress}%</span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className={`h-full ${colorClass} ${shadowClass}`} style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-slate-500 text-sm py-4">
                                        No recent activity. Start a simulation to see your progress here!
                                    </div>
                                )}
                            </div>
                            <div className="md:border-l border-slate-100 md:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
                                <span className="text-4xl font-bold text-slate-900 mb-1">{totalRuns}</span>
                                <span className="text-slate-500 text-sm mb-4">Simulations Run</span>
                                <Link to="/dashboard" className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 7: CTA */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to stop guessing and start understanding?</h2>
                    <p className="text-xl text-slate-600 mb-10">Join thousands of students mastering complex systems with SimuLab.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/explore" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all text-lg">
                            Start Simulating Now
                        </Link>
                        <Link to="/register" className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-lg">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
};

export default LandingPage;
