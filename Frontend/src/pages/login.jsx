import React, { useState } from "react";
// import Navbar from "../components/Navbar";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
// import Footer from "@/components/Footer";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    //   const [navbarHeight, setNavbarHeight] = useState(0);
    const [open, setOpen] = useState(false);
    const [openOtpDialog, setOpenOtpDialog] = useState(false);
    const [resent, setResent] = useState(false);

    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");

    const changeEventhandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sendOtpHandler = async () => {

        if (!validateEmail(input.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/send-otp`, { email: input.email });

            if (res.data.success) {
                toast.success("OTP sent to your email. Please check your inbox.");
                setOpen(false);
                setOpenOtpDialog(true);
            }
        } catch (error) {
            toast.error(error.response.data.message || "Failed to send OTP. Please try again.");
            console.error("Error sending OTP:", error);
        } finally {
            setLoading(false);
        }

    }

    const resentHandler = async () => {
        setResent(true);
        await sendOtpHandler();
        setResent(false);
    }

    const verifyOtpHandler = async () => {

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify-otp`, { email: input.email, otp: otp });

            if (res.data.success) {
                toast.success(res.data.message);
                setOpenOtpDialog(false);
                await resetPasswordHandler();
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error verifying OTP:", error);
            setLoading(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setUser(res.data.user))
                navigate('/');
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const resetPasswordHandler = async () => {
        if (!validateEmail(input.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!input.email || !input.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/reset-password`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dark:bg-[#0a1216] bg-slate-700 min-h-[100vh] p-10">
            <div>
                {/* <div className="bg-gradient-to-b from-yellow-50 to-white dark:bg-none dark:to-[#06121f] h-[50vh]" /> */}
                <div className="py-10 rounded-xl bg-gradient-to-r from-slate-950 to bg-slate-800 max-h-[85vh] ">
                    <h1 className=" text-xl md:text-3xl lg:text-4xl font-bold text-center text-white">Welcome to ChitChat</h1>
                    <div className="flex items-center justify-center mt-5 max-w-3xl mx-auto ">
                        <form
                            onSubmit={submitHandler}
                            className="w-[90%] sm:w-1/2 bg-white/10 dark:bg-white/10 backdrop-blur-md 
             border border-white/20 shadow-lg flex flex-col gap-4 
             rounded-2xl p-6 my-10 transition-all duration-300 hover:shadow-cyan-500/30"
                        >
                            <h1 className="font-bold text-lg md:text-xl lg:text-2xl text-center text-cyan-300 mb-6">
                                Login to Your Account
                            </h1>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-white dark:text-gray-200">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="dark:bg-gray-600 dark:placeholder:text-slate-500 dark:text-slate-900 
                 bg-slate-700 text-white placeholder-gray-300 border border-white/30 
                 rounded-md focus:ring-2 focus:ring-cyan-400"
                                    onChange={changeEventhandler}
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-white dark:text-gray-200">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="dark:bg-gray-100/80 dark:placeholder:text-slate-500 dark:text-slate-900 
                 bg-slate-700 text-white placeholder-gray-300 border border-white/30 
                 rounded-md focus:ring-2 focus:ring-cyan-400"
                                    onChange={changeEventhandler}
                                />
                            </div>

                            {/* Buttons */}
                            {loading ? (
                                <Button className="w-full my-4 bg-black text-white flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Please Wait
                                </Button>
                            ) : (
                                <div className="flex flex-col gap-3 mt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-black text-gray-200 font-semibold"
                                    >
                                        Login
                                    </Button>
                                </div>
                            )}

                            {/* Links */}
                            <p className="text-sm text-gray-300 mt-4 text-center">
                                Forgot your password?
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(true);
                                    }}
                                    className="text-cyan-300 font-semibold hover:underline ml-1"
                                >
                                    Reset Password
                                </button>
                            </p>

                            <p className="text-sm text-gray-300 text-center">
                                Don’t have an account yet?
                                <Link
                                    to="/signup"
                                    className="text-emerald-400 font-semibold hover:underline ml-1"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </form>

                    </div>
                </div>
            </div>
            {/* <Footer /> */}

            {
                open && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className={'flex flex-col gap-3  justify-center p-10 w-90'}>
                            <DialogHeader>
                                <DialogTitle>Reset your password via Email</DialogTitle>
                                <DialogDescription>
                                    Enter your email to reset your password
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col w-70 gap-2 items-center">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={input.email}
                                    onChange={(e) => setInput({ ...input, email: e.target.value })}
                                />
                                <Input
                                    type="password"
                                    placeholder="Enter your new password"
                                    className="my-4"
                                    value={input.password}
                                    onChange={(e) => setInput({ ...input, password: e.target.value })}
                                />
                            </div>

                            {
                                loading ? (
                                    <Button className={'w-70'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait, Sending OTP</Button>
                                ) : (
                                    <Button className={'w-70'} onClick={sendOtpHandler} >Submit</Button>
                                )
                            }

                        </DialogContent>
                    </Dialog>
                )
            }

            {
                openOtpDialog && (
                    <Dialog open={openOtpDialog} onOpenChange={setOpenOtpDialog}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Verify Email</DialogTitle>
                                <DialogDescription>
                                    An OTP has been sent to your email. Please enter it below to continue.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-4 py-4">
                                <Input
                                    type="text"
                                    placeholder="Enter OTP you received"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            <Button variant="link" onClick={resentHandler} className="text-sm text-blue-500 underline">Resend OTP</Button>

                            {
                                loading ? (
                                    <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait, {resent ? "Resending OTP" : "Verifying OTP"}</Button>
                                ) : (
                                    <Button className={'w-full'} onClick={verifyOtpHandler}>Verify OTP</Button>
                                )
                            }

                        </DialogContent>
                    </Dialog>
                )
            }
        </div>
    )
}

export default Login
