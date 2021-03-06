import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import taskAPI from "../../utils/taskAPI";
import { Wrapper, Title } from "../../components/MiniComponents";
import { MenuItem, Typography, Button, Divider, CircularProgress } from "@material-ui/core";
import moment from "moment";
import { TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE } from "../../utils/actions";
import TaskComments from "../../components/TaskComments";
import { UserContext } from "../../utils/UserContext";
import ProjectNav from "../../components/ProjectNav";
import Markdown from "react-markdown";
import DeleteModal from "../Project/DeleteModal";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex"
	},

	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	editDescription: {
		backgroundColor: theme.palette.kone.light
	}
}));

export default function Task() {
	const classes = useStyles();
	const { user } = useContext(UserContext);
	const [editMode, setEditMode] = useState(false);
	const [projectMembers, setProjectMembers] = useState([]);
	const [isMounted, setMounted] = useState(false);
	const [task, setTask] = useState({});
	const [taskDesc, setTaskDesc] = useState("");
	const [comments, setComments] = useState([]);
	const [assignee, setAssignee] = useState("");
	const [openDelete, setDeleteModalOpen] = useState(false)
	const { projectId, id } = useParams();
	const [flash, setFlash] = useState({message: null, type: null})
	useEffect(() => {
		taskAPI
			.getTask(id)
			.then((res) => {
				console.log(res);
				setAssignee(res.task.assignedUser?._id);
				setTask(res.task);
				setTaskDesc(res.task.description);
				setComments(res.task.comments);
				setProjectMembers(res.members);
				setMounted(true);
			})
			.catch((err) => console.log(err));
	}, [id]);

	const handleChangeAssignee = (event) => {
		// console.log(id);
		taskAPI
			.updateTask(id, { assignedUser: event.target.value })
			.then((res) => {
				setAssignee(res.assignedUser);
				setTask({
					...task,
					updatedAt: res.updatedAt
				});
			})
			.catch((err) => console.log(err));
	};
	const handleChangeStatus = (event) => {
		console.log(event.target.value);

		taskAPI
			.updateTask(id, { status: event.target.value })
			.then((res) => {
				console.log("response", res);
				setTask({
					...task,
					updatedAt: res.updatedAt
				});
			})
			.catch((err) => console.log(err));
	};
	const history = useHistory()
	const handleEditMode = () => {
		setEditMode(!editMode);
	};

	const handleDescChange = (event) => {
		setTaskDesc(event.target.value);
	};
	const handleDelete = async event => {
		event.preventDefault();
		let res = await taskAPI.deleteTask(task._id);
		res.success ? history.push(`/project/${task.project._id}`) : setFlash(res.flash)
	}
	
	const handleDescSubmit = () => {
		if (taskDesc) {
			taskAPI
				.updateTask(id, { description: taskDesc })
				.then((res) => {
					console.log(res);
					setTask({
						...task,
						description: res.description,
						updatedAt: res.updatedAt
					});
					setEditMode(!editMode);
				})
				.catch((err) => console.log(err));
		}
	};

	return (
		<div className={clsx(classes.root)}>
			<ProjectNav projectId={projectId}></ProjectNav>
			<DeleteModal task flash={flash} open={openDelete} setOpen={setDeleteModalOpen} onFormSubmit={handleDelete} />
			<Container maxWidth="lg" component="main" className={clsx(classes.content)}>
				<Wrapper>
					<Title>Task: {task.title}</Title>
					{isMounted ? (
						<div>
							<Grid container justify="space-between" spacing={2}>
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										variant="outlined"
										color="secondary"
										label="Created By:"
										defaultValue={task.creator?.firstName + " " + task.creator?.lastName}
										InputProps={{
											readOnly: true
										}}
										helperText={"On: " + moment(task.createdAt).format("M/DD/YYYY")}
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={6} md={3}>
									{projectMembers.length > 0 ? (
										<TextField
											variant="outlined"
											id="select-assignee"
											select
											label="Assigned To:"
											value={assignee}
											onChange={handleChangeAssignee}
											fullWidth
										>
											<MenuItem key="none" value={"NONE"}>
												<em>None</em>
											</MenuItem>
											{projectMembers.map((user) => (
												<MenuItem key={user._id} value={user._id}>
													{user.firstName + " " + user.lastName}
												</MenuItem>
											))}
										</TextField>
									) : null}
								</Grid>
								{/* <Grid item xs={12} sm={6} md={3}>
									<TextField fullWidth variant="outlined" label="Updated On:" value={moment(updateDt).format("M/DD/YYYY h:mm A")} />
								</Grid> */}
								<Grid item xs={12} sm={6} md={3}>
									<TextField
										variant="outlined"
										id="select-assignee"
										select
										label="Status:"
										InputProps={{ defaultValue: task.status }}
										onChange={handleChangeStatus}
										fullWidth
									>
										{[TASK_NEW, TASK_TODO, TASK_WIP, TASK_REVIEW, TASK_DONE].map((stat) => (
											<MenuItem key={stat} value={stat}>
												{stat}
											</MenuItem>
										))}
									</TextField>
								</Grid>
							</Grid>
							<Typography style={{ marginTop: "0.8rem" }} variant="h5" component="h2">
								Details
							</Typography>
							<Divider />
							<Grid container spacing={2}>
								<Grid item>
									<Typography variant="caption">
										Last updated: <b>{moment(task.updatedAt).format("M/DD/YYYY, h:mm A")}</b>
									</Typography>
								</Grid>
								{editMode ? (
									<Grid item sm={12}>
										<TextField
											required
											className={classes.editDescription}
											id="outlined-multiline-static"
											value={taskDesc}
											onChange={handleDescChange}
											multiline
											fullWidth
											rows={5}
											variant="outlined"
										/>
									</Grid>
								) : (
									<Grid item sm={12}>
										<Markdown source={task.description} />
									</Grid>
								)}
							</Grid>
						</div>
					) : (
						<Grid container justify="center">
							<CircularProgress size="5rem" />
						</Grid>
					)}
				</Wrapper>
				<Grid container justify={task.creator === user._id || task.project?.admins.includes(user._id) ? "space-between" : "flex-end"}>
					{editMode ? (
						<React.Fragment>
							<Button color="secondary" onClick={handleEditMode}>
								Cancel
							</Button>
							<Button variant="contained" color="primary" style={{ marginLeft: "1rem" }} onClick={handleDescSubmit}>
								Submit
							</Button>
						</React.Fragment>
					) : (
						<React.Fragment>
							{task.creator === user._id || task.project?.admins.includes(user._id) && (
								<Button variant="outlined" color="secondary" onClick={() => setDeleteModalOpen(true)}>
									Delete
								</Button>
							)}
							<Button variant="contained" color="primary" onClick={handleEditMode}>
								Edit
							</Button>
						</React.Fragment>
					)}
				</Grid>
				<Wrapper style={{ marginTop: "1rem" }}>
					<Grid item sm={12}>
						<TaskComments
							projectId={projectId}
							taskId={task._id}
							comments={comments}
							setComments={setComments}
							user={user}
							admins={task.project?.admins}
						/>
					</Grid>
				</Wrapper>
			</Container>
		</div>
	);
}
