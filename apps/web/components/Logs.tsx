"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSocket, socketListen, socketStopListening } from "@/lib/redux/socketSlice";
import { addLog, logSelector } from "@/lib/redux/logSlice";

const Logs = () => {
    const socket = useSelector(selectSocket);
    const dispatch = useDispatch();
    const logs = useSelector(logSelector);

    useEffect(() => {
        if (socket.disconnected) {
            socket.connect()
        }
        //Check if socket already registered to event
        dispatch(socketStopListening({ event: 'log' }));
        dispatch(socketListen({
            event: 'log', callback: (log: string) => {
                dispatch(addLog(log));
            }
        }));
    }, []);

    return (
        <section className="py-6 px-4 md:py-12 md:px-6">
            <div className="mx-auto max-w-3xl">
                <h2 className="text-2xl font-semibold">Build Logs</h2>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mt-4">
                    {/* <p className="text-sm text-gray-600 dark:text-gray-400">[2024-02-22 10:30:12] Building project...</p> */}
                    {logs.length === 0 ? <p className="text-sm text-gray-600 dark:text-gray-400">Waiting for deployment</p> : logs.map((log, index) => {
                        return (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">{log}</p>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Logs