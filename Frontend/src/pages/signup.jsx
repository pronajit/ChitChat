import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

const Signup = () => {

    const navigate = useNavigate();

    const [loading, setloading] = useState(false);
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [otp, setOtp] = useState("");


    const [input, setInput] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        file: "",
    });

    const changeEventhandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files[0] });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sendOtpHandler = async (e) => {
        e.preventDefault();


        if (!input.email || !input.name || !input.phoneNumber || !input.password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!validateEmail(input.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/send-otp`, { email: input.email });

            if (res.data.success) {
                toast.success("OTP sent to your email. Please check your inbox.");
                setShowOtpDialog(true);
            }
        } catch (error) {
            toast.error("An error occurred while sending the OTP.");
            console.error("Error sending OTP:", error);
        } finally {
            setloading(false);
        }

    }

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            setloading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/otp/verify-otp`, { email: input.email, otp: otp });

            if (res.data.success) {
                toast.success(res.data.message);
                setShowOtpDialog(false);

                await submitHandler(e);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error verifying OTP:", error);
            setloading(false);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        setloading(true);

        try {
            const formData = new FormData();
            formData.append("name", input.name);
            formData.append("email", input.email);
            formData.append("password", input.password);
            formData.append("phoneNumber", input.phoneNumber);
            if (input.file) formData.append("file", input.file);

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                console.log(res.data);
                navigate('/login');
            }

        } catch (error) {
            toast.error(error.response.data.message);
            // console.log(error);

        } finally {
            setloading(false);
        }
    }

    return (
        <div className="bg-slate-500 min-h-[100vh] p-10">
            <div className="py-10 rounded-xl bg-gradient-to-r from-slate-950 to bg-slate-800 max-h-[85vh] ">
                <h1 className=" text-xl md:text-3xl  font-bold text-center text-white">Welcome to ChitChat</h1>
                <div className="flex items-center mt-2 mb-5 justify-center max-w-5xl mx-auto">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="w-[90%] sm:w-1/2 bg-white/10 dark:bg-white/10 backdrop-blur-md 
             border border-white/20 shadow-lg flex flex-col gap-4 
             rounded-2xl p-6 my-10 transition-all duration-300 hover:shadow-cyan-500/30"
                    >
                        <h1 className="font-bold text-lg md:text-xl lg:text-2xl text-center text-blue-300 mb-6">
                            Create a Fresh Account
                        </h1>

                        {/* Full Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                            <Label className="text-white dark:text-gray-200">Full Name</Label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                className=" bg-slate-700 text-white placeholder-gray-300 border border-white/30 rounded-md 
                                            w-full focus:ring-2 focus:ring-slate-900"
                                onChange={changeEventhandler}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-white dark:text-gray-200">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className=" bg-slate-700 text-white  placeholder-gray-300 border border-white/30 rounded-md 
                                            focus:ring-2 focus:ring-slate-900"
                                onChange={changeEventhandler}
                            />
                        </div>
                        </div>
                        

                       <div className="grid grid-cols-2 gap-4">
                           {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-white dark:text-gray-200">Phone Number</Label>
                            <Input
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter your phone number"
                                className=" bg-slate-700 text-white  placeholder-gray-300 border border-white/30 rounded-md 
                                            focus:ring-2 focus:ring-slate-900"
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
                                className="bg-slate-700 text-white  placeholder-gray-300 border border-white/30 rounded-md 
                                            focus:ring-2 focus:ring-slate-900"
                                onChange={changeEventhandler}
                            />
                        </div>

                       </div>
                        

                        {/* Role + File Upload */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mt-3">
                            {/* <RadioGroup defaultValue="attendee" className="flex gap-6">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="attendee"
                                        className="cursor-pointer"
                                        checked={input.role === "attendee"}
                                        onChange={changeEventhandler}
                                    />
                                    <Label className="text-white dark:text-gray-200">User</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="organizer"
                                        className="cursor-pointer"
                                        checked={input.role === "organizer"}
                                        onChange={changeEventhandler}
                                    />
                                    <Label className="text-white dark:text-gray-200">Organizer</Label>
                                </div>
                            </RadioGroup> */}

                            <div className="flex gap-2 items-center">
                                <Label className="text-white dark:text-gray-200">Profile</Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    className="cursor-pointer  text-white"
                                    onChange={changeFileHandler}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        {loading ? (
                            <Button className="w-full my-4 bg-black text-white flex items-center justify-center">
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Please Wait
                            </Button>
                        ) : (
                            <Button onClick={sendOtpHandler} className="w-full bg-black hover:bg-gray-800 text-white font-semibold">
                                Sign Up
                            </Button>
                        )}

                        {/* Links */}
                        <p className="text-sm text-gray-300 text-center mt-4">
                            Already have an account?
                            <Link to="/login" className="text-cyan-300 font-semibold hover:underline ml-1">
                                Login
                            </Link>
                        </p>
                    </form>

                </div>
            </div>

            {/* <Footer /> */}

            {
                showOtpDialog && (
                    <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
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

                            {
                                loading ? <Button className={'w-full my-4'}><Loader2 className="animate-spin mr-2 h-4 w-4" />Please Wait</Button> : (
                                    <Button onClick={verifyOtpHandler} className="w-full">
                                        Verify OTP
                                    </Button>
                                )
                            }
                            <Button variant="outline" className="w-full" onClick={() => setShowOtpDialog(false)}>
                                Cancel
                            </Button>

                        </DialogContent>
                    </Dialog>
                )
            }

        </div>
    );
};

export default Signup;
