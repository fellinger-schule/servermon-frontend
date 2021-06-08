import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Badge from "@material-ui/core/Badge";

import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";

import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./App.css";

import TestData from "./servermon-test.json";

function fetchData() {}

interface IDataDTO {
	name: string;
	hostname: string;
	value: number;
	unit: string;
	created_at: string;
	updated_at: string;
}

interface IData {
	name: string;
	hostname: string;
	value: number;
	unit: string;
	timestamp: Date;
}

interface IDataContainer {
	[key: string]: IData[];
}

function fromDto(dto: IDataDTO): IData {
	const result = {} as IData;
	result.name = dto.name;
	result.hostname = dto.hostname;
	result.value = Number(dto.value);
	result.unit = dto.unit;
	result.timestamp = new Date(dto.created_at);
	return result;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3),
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	heading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(3),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
	sectionDesktop: {
		display: "none",
		[theme.breakpoints.up("md")]: {
			display: "flex",
		},
	},
}));

const graphData = {
	labels: ["1", "2", "3", "4", "5", "6"],
	datasets: [
		{
			label: "CPU Temperature",
			data: [12, 19, 3, 5, 2, 3, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			fill: false,
			backgroundColor: "rgb(255, 99, 132)",
			borderColor: "rgba(255, 99, 132, 0.2)",
		},
	],
};

const options = {
	scales: {
		y: {
			min: 0,
		},
	},
};

function App() {
	const classes = useStyles();
	const [data, setData] = useState({} as IDataContainer);
	const [activeHostname, setHostname] = useState("");
	const [searchFilter, setSearchFilter] = useState("");
	const [expandedPanel, setExpendedPanel] = useState<string | false>(false);

	let isMenuOpen = false;

	const handleExpandChange = (panel: string) => (event: any, isExpanded: boolean) => {
		setExpendedPanel(isExpanded ? panel : false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	function fetchData() {
		let newData: IDataContainer = {};
		let fetchedData: IDataDTO[] = TestData;
		// let fetchedData = (await fetch("file:///D:/Downloads/servermon-test.json").then((data) =>
		// 	data.json()
		// )) as IDataDTO[];

		fetchedData.forEach((element: IDataDTO) => {
			if (!newData[element.name]) {
				newData[element.name] = new Array();
			} else {
				newData[element.name].push(fromDto(element));
			}
		});
		// Sort it
		Object.keys(newData).forEach((key) => {
			newData[key].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
		});

		setData(newData);
		console.log(data);
	}

	const menuId = "primary-filter-machines-menu";
	const renderMenu = (
		<Menu
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			keepMounted
			id={menuId}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			open={isMenuOpen}
			onClose={() => {}}
		>
			<MenuItem onClick={() => {}}>Profile</MenuItem>
			<MenuItem onClick={() => {}}>My account</MenuItem>
		</Menu>
	);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="static">
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="open drawer"
						onClick={() => fetchData()}
					>
						<MenuIcon />
					</IconButton>
					<Typography className={classes.title} variant="h6" noWrap>
						Servermon
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ "aria-label": "search" }}
							onChange={(evt) => setSearchFilter(evt.target.value)}
						/>
					</div>
					<div className={classes.grow} />
				</Toolbar>
			</AppBar>
			{renderMenu}
			<main className={classes.content}>
				{Object.keys(data)
					.filter((key) => key.toString().search(searchFilter) !== -1)
					.map((key) => (
						<Accordion
							expanded={expandedPanel === key.toString()}
							onChange={handleExpandChange(key.toString())}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>{key.toString()}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								{expandedPanel === key.toString() ? (
									<Line
										data={{
											labels: data[key.toString()].map((elm) => elm.timestamp.toLocaleTimeString()),
											datasets: [
												{
													label: key.toString(),
													data: data[key.toString()].map((elm) => elm.value),
													backgroundColor: "rgb(63,81,181)",
													borderColor: "rgba(63, 81, 181, 1)",
													cubicInterpolationMode: "monotone",
													tension: 0.4,
												},
											],
										}}
										options={options}
										type={Chart.ChartType}
										height={50}
									/>
								) : (
									<></>
								)}
							</AccordionDetails>
						</Accordion>
					))}
			</main>
		</div>
	);
}

export default App;
