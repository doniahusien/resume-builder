// Resume.js4

import React, { useRef, useState, useEffect } from 'react';
import style from './resume.module.css';
import { AiTwotonePhone, AiFillLinkedin, AiTwotoneMail } from 'react-icons/ai';
import { TiLocation } from 'react-icons/ti';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Resume = () => {

    const contentRef = useRef(null);
    const [resumeData, setResumeData] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/resumes');
                setResumeData(response.data);

            } catch (error) {
                console.error('Error fetching resume data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDownloadPDF = async () => {
        const lastResume =
            resumeData && resumeData.length > 0 ? resumeData[resumeData.length - 1] : null;

        if (!lastResume) {
            console.error('No resume data available.');
            return;
        }

        const content = contentRef.current;
        const contentWidth = content.offsetWidth;
        const contentHeight = content.offsetHeight;

        // Add a delay to ensure that images are fully loaded
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const canvas = await html2canvas(content, {
            scale: 2, // Adjust the scale if needed
            useCORS: true, // Enable cross-origin resource sharing for images
            width: contentWidth,
            height: contentHeight,
        });

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [contentWidth, contentHeight],
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, contentWidth, contentHeight);

        pdf.save('resume.pdf');
    };




    return (
        <>
            {resumeData && resumeData.length > 0 && (
                <div className="flex flex-col items-center justify-center container w-full ">
                    <div className="flex justify-center items-center py-20 px-7 bg-white rounded-xl " ref={contentRef} style={{ "width": "750px" }}>
                        <div className="w-2/4 p-5 color  flex flex-col gap-12 rounded-t-full ">
                            <div className="info ">

                                <img src={`http://localhost:3001/uploads/${resumeData[resumeData.length - 1].file.filename}`} alt="no img" className="w-40 h-40 rounded-full m-auto" />

                                <ul className="flex flex-col pt-10 gap-5">
                                    <li className='flex flex-row items-center gap-3'>
                                        <span><AiTwotonePhone /></span>
                                        <span>{resumeData[resumeData.length - 1].phone}</span>
                                    </li>

                                    <li className='flex flex-row items-center gap-3'>
                                        <span><AiTwotoneMail /></span>

                                        <span>{resumeData[resumeData.length - 1].email}</span>
                                    </li>

                                    <li className='flex flex-row items-center gap-3'>
                                        <span><TiLocation /></span>

                                        <span>{resumeData[resumeData.length - 1].location}</span>
                                    </li>

                                    <li className='flex flex-row items-center gap-3 '>
                                        <span><AiFillLinkedin /></span>
                                        <span >{resumeData[resumeData.length - 1].linkedin}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={style.skills}>
                                <h1 className='pb-2 text-lg font-bold'>Skills</h1>
                                <ul>
                                    {resumeData[resumeData.length - 1].skills.map((skill, index) => (
                                        <li key={index}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={style.education}>
                                <h1 className=' font-bold text-lg pb-5'>Eduction</h1>
                                <p>{resumeData[resumeData.length - 1].education}</p>
                            </div>
                        </div>


                        <div className="w-full pl-5 flex flex-col justify-center gap-10">
                            <div className='border-b border-black pb-8'>
                                <h1 className=' font-semibold text-4xl pb-5'>{resumeData[resumeData.length - 1].name}</h1>
                                <h3 className='text-xl'>{resumeData[resumeData.length - 1].title}</h3>
                            </div>

                            <div className='border-b border-black pb-8'>
                                <h1 className=' font-semibold text-2xl pb-5'>About me</h1>
                                <p>{resumeData[resumeData.length - 1].about}</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h1 className=' font-semibold text-2xl pb-4'>Projects</h1>
                                {resumeData[resumeData.length - 1].projects.map((project, index) => (
                                    <div key={index} className={style.project}>
                                        <h1 className=' font-semibold text-xl pb-2'>{project.name}</h1>
                                        <p>{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-10 p-10'>
                        <button type="button" className='text-white' onClick={() => { navigate("/") }}>
                            Create Another
                        </button>
                        <button
                            type="button"
                            className="color text-white p-2 rounded-md focus:outline-none focus:ring "
                            onClick={() => {
                                const img = new Image();
                                img.src = `http://localhost:3001/uploads/${resumeData[resumeData.length - 1].file.filename}`;
                                img.onload = () => handleDownloadPDF(img.src);
                            }}
                        >
                            Download PDF
                        </button>
                    </div>


                </div>)}


        </>
    )
}

export default Resume;