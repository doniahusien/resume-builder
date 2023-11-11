// ResumeBuilder.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GrDocumentUpload } from 'react-icons/gr'
const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    skills: [],
    education: '',
    about: '',
    projects: [],
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setUserData({
      ...userData,
      file: selectedFile,
    });
    console.log(selectedFile);
  };
  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim());
    setUserData({
      ...userData,
      skills: skillsArray,
    });
  };

  const handleProjectsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedProjects = [...userData.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [name]: value,
    };
    setUserData({
      ...userData,
      projects: updatedProjects,
    });
  };

  const addProject = () => {
    setUserData({
      ...userData,
      projects: [...userData.projects, { name: '', description: '' }],
    });
  };

  const removeProject = (index) => {
    const updatedProjects = [...userData.projects];
    updatedProjects.splice(index, 1);
    setUserData({
      ...userData,
      projects: updatedProjects,
    });
  };

  // Update the FormData creation in the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', userData.file);
      formData.append('data', JSON.stringify(userData));

      await axios.post('http://localhost:3001/api/resumes', formData);
      navigate('/resume');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };




  return (
    <>
      <div className="flex items-center justify-around h-screen gap-5">
        <div className="rounded-md">
          <h1 className="text-4xl font-bold mb-6 text-white ">Resume Builder</h1>
          <p className="text-gray-300 mb-6">
            Create your professional resume with our easy-to-use builder.
          </p>
        </div>

        <div className="max-w-4xl w-full p-8 rounded-md shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <label
                htmlFor="fileInput"
                className="flex items-center justify-center p-4 text-white rounded-md cursor-pointer color">
                <GrDocumentUpload className="mr-2 text-white" />
                Choose Image
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
              />
              <input type="text" name="name" placeholder="Name" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="title" placeholder="Title" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="phone" placeholder="Phone" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none " />
              <input type="text" name="location" placeholder="Location" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none " />
            </div>

            <input type="text" name="linkedin" placeholder="LinkedIn" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />

            <input type="text" name="skills" placeholder="Skills (comma-separated)" onChange={handleSkillsChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none " />

            <input type="text" name="education" placeholder="Education" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none " />

            <input type="text" name="about" placeholder="About" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none " />

            {userData.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <input type="text" name="name" placeholder="Project Name" value={project.name} onChange={(e) => handleProjectsChange(e, index)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
                <input type="text" name="description" placeholder="Project Description" value={project.description} onChange={(e) => handleProjectsChange(e, index)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none" />
                <button type="button" onClick={() => removeProject(index)} className="text-red-500">Remove Project</button>
              </div>
            ))}
            <button type="button" onClick={addProject} className=" p-8 text-slate-100">Add Project</button>

            <button type="submit" className="color text-white p-2 rounded-md hover:text-pink-900 hover:bg-gray-300 focus:outline-none focus:ring ">Create Resume</button>
          </form>
        </div>

      </div>

    </>


  );
};

export default ResumeBuilder;
