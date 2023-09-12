import React, { useState } from "react";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Input from "@mui/material/Input";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useSelector } from "react-redux";
import { useGetAllUserPredefinedQuery } from "../store/api/predefinedApi";
import { useLazyGetTemplateByTaglineQuery } from "../store/api/templateApi";
import { useCreateInvoiceMutation } from "../store/api/invoiceApi";
import toast from "react-hot-toast";

const InvoiceCreate = () => {

	const [tagSelected, setTagSelected] = useState('');
	const [isLoading, setIsLoading] = useState(false)

	const user = useSelector((state) => state.users.user)
	const template = useSelector((state) => state.templates.template);
	const predefined = useSelector((state) => state.predefined.predefines);
	const { } = useGetAllUserPredefinedQuery({ userId: user._id }, { refetchOnMountOrArgChange: true, skip: false });

	const [details, setDetails] = useState({})

	const [trigger, result] = useLazyGetTemplateByTaglineQuery();
	const [createInvoice] = useCreateInvoiceMutation();

	const handleChange = (e) => {
		setTagSelected(e.target.value)
		trigger({ tagId: e.target.value })
	}

	const handleDetails = (e) => {
		setDetails({ ...details, [e.target.name]: e.target.value })
	}

	const handleSubmit = async() => {
		try {
			setIsLoading(true);

			const body = {userId: user._id, templateId: template?._id, invoiceDate: details?.invoiceDate, terms: details?.terms, modeOfPayment: details?.modeOfPayment };

			await createInvoice(body).unwrap();

			toast.success("Invoice Created Successfully!", { duration: 1000, position:'top-center'});

		} catch (error) {
			toast.error(error.message, { duration: 1000, position:'top-center'});
			console.log(error)
		}finally {
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
			<Box
				style={{
					width: '282px',
					height: '56px',
					margin: '10px 0'
				}}
			>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Predefined</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={tagSelected}
						label="Predefined"
						onChange={handleChange}
					>
						{predefined.map((ele) => (
							<MenuItem key={ele._id} value={ele._id}>{ele.title}</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{result?.isUninitialized && "Select a predefined"}
			{result?.isLoading && "Loading..."}
			{result?.isError && "Something went wrong! try again..."}
			{result?.data === null && "No Templates Found"}
			{result?.data && result?.isSuccess &&
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
								{result.data.schoolName}
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
								{result.data.address[0]},
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
								Udupi, Karnataka 576103
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

								{result.data.emailId}
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
								{result.data.phoneNo.map((value) => (<span key={value} style={{ margin: "0 3px" }}>{value}</span>))}
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
								GST Number : {result.data.schoolName}
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
						{/* <Box
							variant="div"
							sx={{
								marginBottom: "10px",
								width: "533px",
							}}
						>

							<Box
								variant="div"
								sx={{
									alignContent: "center",
									marginTop: "20px",
									paddingTop: "20px",
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
									Name
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
										padding: "8px",
									}}
								>
									<Box

									>
										<DescriptionOutlinedIcon
											sx={{
												color: "#B1B2B2",
												margin: '0 5px'
											}}
										/>
									</Box>
									<Input
										disableUnderline
										placeholder="Placeholder"
										sx={{
											width: "490px",
											height: "24px",
											fontSize: "16px",
											marginRight: "15px",
											padding: "0 3px",
											color: 'black'
										}}
										value={result.data.schoolName}
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
									paddingTop: "20px",
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
									Email
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
										padding: "8px",
									}}
								>
									<Box

									>
										<DescriptionOutlinedIcon
											sx={{
												color: "#B1B2B2",
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
											fontSize: "16px",
											color: "black",
											marginRight: "15px",
											padding: "0 3px",
										}}
										value={result.data.emailId}
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
									Address
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
										padding: "8px",
									}}
								>
									<Box

									>
										<DescriptionOutlinedIcon
											sx={{
												color: "#B1B2B2",
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
											fontSize: "16px",
											color: "black",
											padding: "3px",
										}}
										value={result.data.address[0]}
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
									State/City
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
										padding: "8px",
									}}
								>
									<Box

									>
										<DescriptionOutlinedIcon
											sx={{
												color: "#B1B2B2",
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
											fontSize: "16px",
											color: "black",
											marginRight: "15px",
											padding: "3px",
										}}
										name="state"
										value={result.data?.state || details?.state}
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
									marginTop: "25px",
									width: "254px",
									marginRight: "25px",
								}}
							>
								<Typography
									sx={{
										width: "254px",
										height: "18px",
										fontSize: "14px",
										fontWeight: "500",
										lineHeight: "17.5px",
										fontFamily: "Inter",
										color: "#57595A",
									}}
								>
									Pin Code
								</Typography>
								<Box
									sx={{
										border: "2px solid #D2D3D3",
										borderRadius: "6px",
										width: "254px",
										height: "48px",
										display: "flex",
										justifyContent: 'space-evenly',
										alignItems: 'center',
										paddingTop: "4px",

									}}
								>
									<Box

									>
										<AddLinkIcon
											sx={{
												color: "#B1B2B2",
												marginRight: "0 5px",
											}}
										/>
									</Box>
									<Input
										disableUnderline
										placeholder="Placeholder"
										sx={{
											width: "366px",
											height: "24px",
											fontSize: "16px",
											color: 'black'
										}}
										name="pincode"
										value={result.data?.pincode || details?.pincode}
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
									marginTop: "25px",
									width: "254px",
									marginRight: "25px",
								}}
							>
								<Typography
									sx={{
										width: "254px",
										height: "18px",
										fontSize: "14px",
										fontWeight: "500",
										lineHeight: "17.5px",
										fontFamily: "Inter",
										color: "#57595A",
									}}
								>
									Phone Number
								</Typography>
								<Box
									sx={{
										border: "2px solid #D2D3D3",
										borderRadius: "6px",
										width: "254px",
										height: "48px",
										display: "flex",
										justifyContent: 'space-evenly',
										alignItems: 'center',
										paddingTop: "4px",

									}}
								>
									<Box

									>
										<AddLinkIcon
											sx={{
												color: "#B1B2B2",
												marginRight: "0 5px",
											}}
										/>
									</Box>
									<Input
										disableUnderline
										placeholder="Placeholder"
										sx={{
											width: "366px",
											height: "24px",
											color: 'black',
											fontSize: "16px",
										}}
										name="phonenumber"
										value={result.data.phoneNo}
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
									marginTop: "25px",
									width: "254px",
									marginRight: "25px",
								}}
							>
								<Typography
									sx={{
										width: "254px",
										height: "18px",
										fontSize: "14px",
										fontWeight: "500",
										lineHeight: "17.5px",
										fontFamily: "Inter",
										color: "#57595A",
									}}
								>
									GST Number
								</Typography>
								<Box
									sx={{
										border: "2px solid #D2D3D3",
										borderRadius: "6px",
										width: "254px",
										height: "48px",
										display: "flex",
										justifyContent: 'space-evenly',
										alignItems: 'center',
										paddingTop: "4px",
										gap: '2px'
									}}
								>
									<Box

									>
										<AddLinkIcon
											sx={{
												color: "#B1B2B2",
												marginRight: "0 5px",
											}}
										/>
									</Box>
									<Input
										disableUnderline
										placeholder="Placeholder"
										sx={{
											width: "366px",
											height: "24px",
											color: 'black',
											fontSize: "16px",
										}}
										value={result.data?.gstNo}
									/>
									<Box>
										<ClearIcon
											sx={{
												color: "#B1B2B2",
												marginTop: "8px",
												marginLeft: "10px",
												height: "20px",
												width: "20px",
												cursor: "pointer",
											}}
										/>
									</Box>
								</Box>
							</Box>

						</Box> */}
					</Box>

					<Box>
						{/* <Box
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
								Invoice Number
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
										fontSize: "16px",
										color: "black",
										marginRight: "15px",
										padding: "3px",
									}}
									name="invoicenumber"
									value={details.invoicenumber}
									onChange={handleDetails}
								/>
								<Box>
									<ClearIcon
										sx={{
											color: "#B1B2B2",
											marginTop: "8px",
											marginLeft: "10px",
											height: "20px",
											width: "20px",
											cursor: "pointer",
										}}
									/>
								</Box>
							</Box>
						</Box> */}
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
		</Box>
	);
};

export default InvoiceCreate;
