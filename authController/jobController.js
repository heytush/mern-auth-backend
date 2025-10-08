import Job from "../models/jobModel.js";

export const getJobs = async (req, res) => {
  const jobs = await Job.find({ user: req.user._id });
  res.json({ jobs });
};

export const createJob = async (req, res) => {
  const { title, company, location, salary, description } = req.body;
  const job = new Job({
    title,
    company,
    location,
    salary,
    description,
    user: req.user._id,
  });
  const createdJob = await job.save();
  res.status(201).json(createdJob);
};

export const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job && job.user.toString() === req.user._id.toString()) {
    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};

export const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (job && job.user.toString() === req.user._id.toString()) {
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};
