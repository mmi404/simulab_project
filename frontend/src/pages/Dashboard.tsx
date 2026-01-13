const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Coming Soon</h1>
            <p className="text-gray-500 max-w-md">
                We are currently building the user dashboard to track your simulation progress.
                Check back in the next update!
            </p>
        </div>
    );
};

export default Dashboard;
