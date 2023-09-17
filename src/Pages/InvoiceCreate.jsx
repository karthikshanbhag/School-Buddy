import React, { useEffect, useRef, useState } from "react";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Input from "@mui/material/Input";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useSelector } from "react-redux";
import { useGetAllUserPredefinedQuery } from "../store/api/predefinedApi";
import { useGetUserTemplatesQuery, useLazyGetTemplateByTaglineQuery } from "../store/api/templateApi";
import { useCreateInvoiceMutation } from "../store/api/invoiceApi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import PdfModal from "../components/PdfModal";

const InvoiceCreate = () => {

	const [tagSelected, setTagSelected] = useState('');
	const [isLoading, setIsLoading] = useState(false)
	const [details, setDetails] = useState({})
	const [pdfData, setPdfData] = useState("")

	const pdfOpenRef = useRef()

	const user = useSelector((state) => state.users.user)
	const predefined = useSelector((state) => state.predefined.predefines);


	const { } = useGetAllUserPredefinedQuery({ userId: user._id }, { refetchOnMountOrArgChange: true, skip: false });
	const { refetch, data: template = {}, isSuccess, isError, isLoading: queryLoading, error } = useGetUserTemplatesQuery(user._id, {
		refetchOnMountOrArgChange: true
	})

	const [createInvoice] = useCreateInvoiceMutation();


	useEffect(() => {
		refetch()
	}, [refetch])


	const handleChange = (e) => {
		setTagSelected(e.target.value)
	}

	const handleDetails = (e) => {
		setDetails({ ...details, [e.target.name]: e.target.value })
	}

	const handleSubmit = async () => {
		try {
			setIsLoading(true);

			if (tagSelected === '') {
				toast.error('Please select a predefined', { duration: 1000, position: 'top-center' });
				return;
			} else if (!details?.invoiceDate || !details?.terms || !details?.modeOfPayment) {
				toast.error('All the fields are required', { duration: 1000, position: 'top-center' });
				return;
			}

			const body = { userId: user._id, templateId: template?._id, tagId: tagSelected, invoiceDate: details?.invoiceDate, terms: details?.terms, modeOfPayment: details?.modeOfPayment };

			const data = await createInvoice(body).unwrap();
			const base64 = btoa(String.fromCharCode(...new Uint8Array(data.data)));
			// const res =  JSON.stringify(data);
			console.log(base64)
			toast.success("Invoice Created Successfully!", { duration: 1000, position: 'top-center' });

			// const blob = new Blob([data], { type: 'application/pdf', encoding: 'utf-8'});
			const link = document.createElement('a');
			link.href = `data:application/pdf;base64,${base64}`;
			link.download = 'invoice.pdf';
			link.click();

			link.remove()

			setTimeout(() => {
				pdfOpenRef.current.click()
			}, 200);

		} catch (error) {
			toast.error("Error: "+ error, { duration: 1000, position: 'top-center' });
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Box
			variant="div"
			sx={{
				display: "flex",
				justifyContent: 'space-evenly',
				alignItems: "center",
				flexDirection: "column",
				marginTop: "50px",
				marginBottom: "50px",
			}}
		>
			<Link to={`data:application/pdf;base64,${pdfData}`} target="_blank" style={{ display: "none" }} ref={pdfOpenRef} />
			{queryLoading && "Loading..."}
			{isError && "Something went wrong! try again..."}
			{template === null && "No Templates Found"}
			{template && isSuccess &&
				<Box>

					<Box style={{ marginTop: '8px' }}>
						<Box
							sx={{
								alignContent: "center",
								width: "533px",
								// display:'flex',
								// justifyContent:'center',
								// alignItems:'center',
							}}
						>
							{/* <Typography
								sx={{
									width: "430px",
									fontSize: "18px",
									lineHeight: "24px",
									fontColor: "#363931",
									fontWeight: "400",
									fontFamily: "Inter"
								}}
							>
								#Pre filled data from template
							</Typography> */}
							<Typography
								variant="h3"
								sx={{
									width: "430px",
									fontSize: "24px",
									fontWeight: "600",
									lineHeight: "30px",
									fontColor: "#363931",
									fontFamily: "Lora"
								}}
							>
								{template?.schoolName}
							</Typography>
							<Typography
								sx={{
									marginTop: "10px",
									width: "430px",
									fontSize: "14px",
									lineHeight: "21px",
									fontWeight: "400",
									fontColor: "#363931",
									fontFamily: "Inter"
								}}
							>
								{template?.address},
							</Typography>
							{/* <Typography
								sx={{
									marginTop: "10px",
									width: "430px",
									fontSize: "14px",
									lineHeight: "21px",
									fontWeight: "400",
									fontColor: "#363931",
									fontFamily: "Inter"
								}}
							>
								Udupi, Karnataka 576103
							</Typography> */}
							<Typography
								sx={{
									marginTop: "10px",
									width: "430px",
									fontSize: "14px",
									lineHeight: "21px",
									fontWeight: "400",
									fontColor: "#363931",
									fontFamily: "Inter"
								}}
							>

								{template?.emailId}
							</Typography>
							<Typography
								sx={{
									marginTop: "10px",
									width: "430px",
									fontSize: "14px",
									lineHeight: "21px",
									fontWeight: "400",
									fontColor: "#363931",
									fontFamily: "Inter"
								}}
							>
								Phone Number: {template?.phoneNo.map((value) => (<span key={value} style={{ margin: "0 3px" }}>{value} |</span>))}
							</Typography>
							<Typography
								sx={{
									marginTop: "10px",
									width: "430px",
									fontSize: "14px",
									lineHeight: "21px",
									fontWeight: "400",
									fontColor: "#363931",
									fontFamily: "Inter"
								}}
							>
								GST Number : {template?.gstNo}
							</Typography>

							{/* <Typography
								sx={{
									marginTop: "50px",
									marginBottom: "20px",
									width: "430px",
									fontSize: "18px",
									lineHeight: "24px",
									fontColor: "#363931",
									fontWeight: "400",
									fontFamily: "Inter"
								}}
							>
								#Pre filled data from template
							</Typography> */}
						</Box>

					</Box>

					<Box
						style={{
							width: '282px',
							height: '56px',
							margin: '15px 0'
						}}
					>
						<FormControl fullWidth>
							{predefined.length === 0 ?
								<InputLabel id="demo-simple-select-label" style={{ color: 'red', fontStyle: 'italic' }}>No Predefines</InputLabel>
								:
								<InputLabel id="demo-simple-select-label">Predefined</InputLabel>
							}
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								value={tagSelected}
								label="Predefined"
								onChange={handleChange}
								disabled={predefined.length === 0}
								style={{
									':disabled': {
										color: 'red'
									}
								}}
							>
								{predefined.map((ele) => (
									<MenuItem key={ele._id} value={ele._id}>{ele.title}</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box>

						<Box
							variant="div"
							sx={{
								alignContent: "center",
								marginTop: "15px",
								// border: "1px 0px 0px 0px",
								// borderTop: "1px solid #EAEAEA",
								paddingTop: "15px",
							}}
						>
							<Typography
								sx={{
									width: "438px",
									height: "18px",
									fontSize: "14px",
									fontWeight: "500",
									lineHeight: "17.5px",
									fontFamily: "Inter",
									color: "#57595A",
								}}
							>
								Date
							</Typography>
							<Box
								sx={{
									border: "2px solid #D2D3D3",
									borderRadius: "6px",
									width: "533px",
									height: "48px",
									display: "flex",
									justifyContent: 'space-evenly',
									alignItems: 'center',
									// paddingTop: "4px",
									padding: "8px",
									//   ":hover": {border: "2px solid "},
									//   transition:'all 0.2s ease-in-out',
									//   ":hover":{borderColor:"#8E9090"},
								}}
							>
								<Box
									sx={
										{
											// marginLeft: '5px',
											// Padding: '8px'
										}
									}
								>
									<DescriptionOutlinedIcon
										sx={{
											color: "#B1B2B2",
											// marginTop: "8px",
											// marginRight: '5px'
											margin: "0 5px",
											padding: "0px",
										}}
									/>
								</Box>
								<Input
									type='date'
									disableUnderline
									placeholder="Placeholder"
									sx={{
										width: "490px",
										height: "24px",
										// marginTop: "8px",
										fontSize: "16px",
										color: "black",
										marginRight: "15px",
										padding: "3px",
									}}
									name="invoiceDate"
									value={details?.value}
									onChange={handleDetails}
								/>

								{/* <Box>
									<ClearIcon
										sx={{
											color: "#B1B2B2",
											marginLeft: "10px",
											height: "20px",
											width: "20px",
											cursor: "pointer",
										}}
									/>
								</Box> */}
							</Box>
						</Box>
						<Box
							variant="div"
							sx={{
								alignContent: "center",
								marginTop: "15px",
								// border: "1px 0px 0px 0px",
								// borderTop: "1px solid #EAEAEA",
								paddingTop: "15px",
							}}
						>
							<Typography
								sx={{
									width: "438px",
									height: "18px",
									fontSize: "14px",
									fontWeight: "500",
									lineHeight: "17.5px",
									fontFamily: "Inter",
									color: "#57595A",
								}}
							>
								Terms
							</Typography>
							<Box
								sx={{
									border: "2px solid #D2D3D3",
									borderRadius: "6px",
									width: "533px",
									height: "48px",
									display: "flex",
									justifyContent: 'space-evenly',
									alignItems: 'center',
									// paddingTop: "4px",
									padding: "8px",
									//   ":hover": {border: "2px solid "},
									//   transition:'all 0.2s ease-in-out',
									//   ":hover":{borderColor:"#8E9090"},
								}}
							>
								<Box
									sx={
										{
											// marginLeft: '5px',
											// Padding: '8px'
										}
									}
								>
									<DescriptionOutlinedIcon
										sx={{
											color: "#B1B2B2",
											// marginTop: "8px",
											// marginRight: '5px'
											margin: "0 5px",
											padding: "0px",
										}}
									/>
								</Box>
								<Input
									disableUnderline
									placeholder="Placeholder"
									sx={{
										width: "490px",
										height: "24px",
										// marginTop: "8px",
										fontSize: "16px",
										color: "black",
										marginRight: "15px",
										padding: "3px",
									}}
									name="terms"
									value={details?.terms}
									onChange={handleDetails}
								/>
								<Box>
									<ClearIcon
										sx={{
											color: "#B1B2B2",
											marginLeft: "10px",
											height: "20px",
											width: "20px",
											cursor: "pointer",
										}}
									/>
								</Box>
							</Box>
						</Box>
						<Box
							variant="div"
							sx={{
								alignContent: "center",
								marginTop: "15px",
								// border: "1px 0px 0px 0px",
								// borderTop: "1px solid #EAEAEA",
								paddingTop: "15px",
							}}
						>
							<Typography
								sx={{
									width: "438px",
									height: "18px",
									fontSize: "14px",
									fontWeight: "500",
									lineHeight: "17.5px",
									fontFamily: "Inter",
									color: "#57595A",
								}}
							>
								Mode of Payment
							</Typography>
							<Box
								sx={{
									border: "2px solid #D2D3D3",
									borderRadius: "6px",
									width: "533px",
									height: "48px",
									display: "flex",
									justifyContent: 'space-evenly',
									alignItems: 'center',
									// paddingTop: "4px",
									padding: "8px",
									//   ":hover": {border: "2px solid "},
									//   transition:'all 0.2s ease-in-out',
									//   ":hover":{borderColor:"#8E9090"},
								}}
							>
								<Box
									sx={
										{
											// marginLeft: '5px',
											// Padding: '8px'
										}
									}
								>
									<DescriptionOutlinedIcon
										sx={{
											color: "#B1B2B2",
											// marginTop: "8px",
											// marginRight: '5px'
											margin: "0 5px",
											padding: "0px",
										}}
									/>
								</Box>
								<Input
									disableUnderline
									placeholder="Placeholder"
									sx={{
										width: "490px",
										height: "24px",
										// marginTop: "8px",
										fontSize: "16px",
										color: "black",
										marginRight: "15px",
										padding: "3px",
									}}
									name="modeOfPayment"
									value={details?.modeOfPayment}
									onChange={handleDetails}
								/>
								<Box>
									<ClearIcon
										sx={{
											color: "#B1B2B2",
											marginLeft: "10px",
											height: "20px",
											width: "20px",
											cursor: "pointer",
										}}
									/>
								</Box>
							</Box>
						</Box>
					</Box>

					<Button
						type="button"
						sx={{
							marginTop: "25px",
							backgroundColor: "#FFE393",
							width: "253px",
							height: "48px",
							borderRadius: '6px',
							":hover": { backgroundColor: "#ffe8a8" },
							textColor: "#363939",
						}}
						variant="contained"
						disableElevation
						disabled={isLoading}
						onClick={handleSubmit}
					>
						<Typography
							variant="h4"
							sx={{
								color: "#363939",
								fontSize: "18px",
								fontWeight: "600",
								lineHeight: "22.5px",
								textAlign: "center",
								cursor: "pointer",
								textTransform: "none",
								width: "100%",
								fontFamily: "Lora",
							}}
						>
							Create
						</Typography>
					</Button>

				</Box>
			}

			{/* <PdfModal /> */}
		</Box>
	);
};

export default InvoiceCreate;
