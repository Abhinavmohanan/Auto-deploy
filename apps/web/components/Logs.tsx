import React from 'react'

const Logs = () => {
    return (
        <section className="py-6 px-4 md:py-12 md:px-6">
            <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-semibold">Build Logs</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">[2024-02-22 10:30:12] Building project...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">[2024-02-22 10:30:15] Installing dependencies...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">[2024-02-22 10:30:20] Running tests...</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">[2024-02-22 10:30:25] Deployment successful!</p>
                </div>
            </div>
        </section>
    )
}

export default Logs