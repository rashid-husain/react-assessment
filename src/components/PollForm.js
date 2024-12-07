import React, { useState, useEffect, useRef } from 'react';
import CarouselSteps from './CarouselSteps';
import { useDispatch, useSelector } from 'react-redux';
import { resetPoll, setSelectedAnswer, submitPollFailure, submitPollRequest, submitPollSuccess } from '../store/pollSlice';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

const PollForm = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(0); // Starting position of the mouse
    const [isTransitioning, setIsTransitioning] = useState(false); // Prevent multiple transitions
    const containerRef = useRef(null);
    const dispatch = useDispatch();

    const totalSteps = steps.length + 1;

    const selectedAnswers = useSelector((state) => state.poll.selectedAnswers);
    const isPollSubmitted = useSelector((state) => state.poll.isPollSubmitted);
    const isLoading = useSelector((state) => state.poll.isLoading);
    const error = useSelector((state) => state.poll.error);

    // Handle mouse down event (start dragging)
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos(e.clientY); // Record the initial mouse position
    };

    // Handle mouse move event (dragging)
    const handleMouseMove = (e) => {
        if (!isDragging || isTransitioning) return; // Prevent movement during transition
        const diff = startPos - e.clientY; // Calculate the difference in mouse movement
        if (Math.abs(diff) > 100) { // Trigger slide if movement exceeds threshold
            if (diff > 0) {
                handleNext(); // Dragged downwards
            } else {
                handlePrevious(); // Dragged upwards
            }
            setStartPos(e.clientY); // Reset start position for continuous dragging
        }
    };

    // Handle mouse up event (stop dragging)
    const handleMouseUp = () => {
        setIsDragging(false); // Stop dragging
    };

    // Move to the next step
    const handleNext = () => {
        if (isTransitioning || currentStep >= steps.length) return; // Prevent transition if already in progress
        setIsTransitioning(true);
        setCurrentStep(currentStep + 1); // Move to the next step
    };

    // Move to the previous step
    const handlePrevious = () => {
        if (isTransitioning || currentStep <= 0) return; // Prevent transition if already in progress
        setIsTransitioning(true);
        setCurrentStep(currentStep - 1); // Move to the previous step
    };

    // Handle the scroll event to change the step
    const handleScroll = (e) => {
        e.preventDefault(); // Prevent default scrolling behavior

        if (isTransitioning) return; // Prevent scroll action during transition

        if (e.deltaY > 0) {
            handleNext(); // Scroll down
        } else {
            handlePrevious(); // Scroll up
        }
    };

    // Reset transition lock after a transition ends
    useEffect(() => {
        if (!isTransitioning) return;

        // After transition finishes, unlock it
        const transitionEnd = setTimeout(() => {
            setIsTransitioning(false);
        }, 500); // Match this with the transition duration

        return () => clearTimeout(transitionEnd);
    }, [isTransitioning]);

    // Add scroll event listener (if you still want scroll support)
    useEffect(() => {
        window.addEventListener('wheel', handleScroll, { passive: true });
        // Cleanup scroll listener
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentStep, isTransitioning]);

    // Automatic slide transition every 3 seconds
    useEffect(() => {
        const autoSlideInterval = setInterval(() => {
            if (!isTransitioning) {
                handleNext(); // Move to next slide automatically
            }
        }, 3000); // Change slide every 3 seconds

        // Cleanup interval on component unmount or when transition occurs
        return () => clearInterval(autoSlideInterval);
    }, [isTransitioning, currentStep]);

    const handleOptionClick = (stepIndex, optionLabel) => {
        dispatch(setSelectedAnswer({ stepIndex, answer: optionLabel }));
    };

    // Submit poll action
    const handleSubmitPoll = async () => {
        dispatch(submitPollRequest());
        try {
            const response = await fetch('https://api.mockapi.com/api/v2/submitpoll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'f9dcaf18ce28498b8e74d039c43c9ac7'
                },
                body: JSON.stringify({
                    answers: selectedAnswers,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit poll');
            }

            const data = await response.json();
            dispatch(submitPollSuccess());
            alert('Poll submitted successfully!');// optional that can remove
        } catch (err) {
            dispatch(submitPollFailure(err.message || 'Failed to submit poll'));
            alert('Error: ' + (err.message || 'Something went wrong'));
        }
    };


    // Restart the poll
    const handleRestartPoll = () => {
        dispatch(resetPoll());
        setCurrentStep(0); // Go back to the first step
    };

    return (
        <>
            <div
                ref={containerRef}
                className="mx-auto bg-white shadow-lg overflow-hidden"
                style={{ height: "100vh", overflow: "hidden" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className="flex min-h-screen overflow-hidden relative"
                        style={{
                            transform: `translateY(-${currentStep * 100}%)`,
                            transition: "transform 0.5s ease-in-out",
                        }}
                    >
                        {/* Check if it's the last step (summary) */}
                        {index < steps.length ? (
                            <>
                                {/* Left Section */}
                                <div className="w-1/2 bg-blue-800 flex items-center justify-center p-[100px]">
                                    <div className="ml-5">
                                        <h2 className="text-[30px] sm:text-[50px] md:text-[60px] lg:text-[70px] font-bold text-white">
                                            {steps[index].title}
                                        </h2>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="w-1/2 bg-gray-50 flex flex-col items-center justify-center">
                                    <div className="grid grid-cols-3 gap-6">
                                        {steps[index].options.map((option, optIndex) => (
                                            <div
                                                key={optIndex}
                                                onClick={() => handleOptionClick(index, option.label)}
                                                className={`group flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 ${selectedAnswers[index] === option.label
                                                    ? "ring-2 ring-blue-500"
                                                    : ""
                                                    }`}
                                            >
                                                <img
                                                    src={option.icon}
                                                    alt={option.label}
                                                    className="w-16 h-16"
                                                />
                                                <span className="opacity-0 group-hover:opacity-100 text-gray-800 mt-2 transition-opacity">
                                                    {option.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedAnswers[index] && (
                                        <p className="text-sm text-gray-600 mt-4">
                                            Selected: <strong>{selectedAnswers[index]}</strong>
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Summary Slide
                            <div className="w-full bg-green-300 flex flex-col items-center justify-center p-10">
                                {isPollSubmitted && (
                                    <Snackbar
                                        open={isPollSubmitted}
                                        autoHideDuration={6000}
                                        message="Thank you for submitting the poll!"
                                    />
                                    // <h1 className="text-gray-600 mb-10">Thank you for submitting the poll!</h1>
                                )}
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Summary of Your Answers
                                </h2>
                                <ul className="list-disc text-gray-600 ml-5">
                                    {steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="mb-2">
                                            <strong>{step.title}:</strong>{" "}
                                            {selectedAnswers[stepIndex] || "No answer selected"}
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex'>
                                    <button
                                        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4" // Added margin-right for gap
                                        onClick={handleRestartPoll} // Restart poll
                                    >
                                        Restart Poll
                                    </button>

                                    {/* Submit Poll Button */}
                                    <button
                                        className="mt-6 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={handleSubmitPoll} // Handle submit
                                    >
                                        Submit Poll
                                    </button>
                                </div>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </div>

                        )}
                    </div>
                ))}
            </div>

            {/* Steps Navigation Component */}
            <CarouselSteps steps={steps} currentStep={currentStep} />
        </>
    );
};

export default PollForm;
