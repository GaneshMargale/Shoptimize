import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Items from "./data/items.json";

const GlobalStyle = createGlobalStyle`
   body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
   }
`;

function App() {
	const [budget, setBudget] = useState(null);
	const [spent, setSpent] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [cart, setCart] = useState([]);
	const [showBudgetModal, setShowBudgetModal] = useState(true);
	const [showFinalListModal, setShowFinalListModal] = useState(false);
	const [currentSuggestion, setCurrentSuggestion] =
		useState("What do you need?");

	const handleSetBudget = (e) => {
		e.preventDefault();
		const budgetValue = e.target.elements.budgetInput.value;
		if (!isNaN(budgetValue) && budgetValue > 0) {
			setBudget(parseFloat(budgetValue));
			setShowBudgetModal(false);
		} else {
			alert("Please enter a valid numeric budget.");
		}
	};

	const handleAddItem = (item, quantity) => {
		const totalCost = item.price * quantity;
		if (spent + totalCost > budget) {
			alert("Budget exceeded! Cannot add this item.");
		} else {
			const newItem = { ...item, quantity };
			setCart([...cart, newItem]);
			setSpent(spent + totalCost);
			setCurrentSuggestion(item.suggestion || "What do you need?");
		}
	};

	const handleDeleteItem = (index) => {
		const updatedCart = [...cart];
		const removedItem = updatedCart.splice(index, 1)[0];
		setSpent(spent - removedItem.price * removedItem.quantity);
		setCart(updatedCart);
	};

	const handleDoneClick = () => {
		setShowFinalListModal(true);
	};

	const handleCloseModal = () => {
		setShowFinalListModal(false);
	};

	const filteredItems = Items.initialItems.filter((item) =>
		item.description.toLowerCase().startsWith(searchTerm.trim().toLowerCase())
	);

	return (
		<>
			<GlobalStyle />
			<AppContainer>
				<Header>Shoptimize</Header>
				{showBudgetModal && (
					<ModalBackdrop>
						<ModalContent>
							<form onSubmit={handleSetBudget}>
								<h2>Enter Your Budget</h2>
								<ModalInput
									type="number"
									name="budgetInput"
									placeholder="Enter budget"
									required
								/>
								<ModalButton type="submit">Set Budget</ModalButton>
							</form>
						</ModalContent>
					</ModalBackdrop>
				)}
				{budget && (
					<>
						<BudgetInfo>
							<BudgetText>Budget: ₹{budget}</BudgetText>
							<BudgetText>Spent: ₹{spent}</BudgetText>
						</BudgetInfo>
						<SearchSection>
							<SearchInput
								type="text"
								placeholder="Search item..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<SearchResults>
								{searchTerm &&
									filteredItems.map((item) => (
										<SearchResultItem key={item.id}>
											<span>
												{item.description} - ₹{item.price}
											</span>
											<ItemControls>
												<input
													type="number"
													min="1"
													defaultValue="1"
													onChange={(e) =>
														(item.quantity = parseInt(e.target.value))
													}
												/>
												<AddButton
													onClick={() =>
														handleAddItem(item, item.quantity || 1)
													}
												>
													Add
												</AddButton>
											</ItemControls>
										</SearchResultItem>
									))}
							</SearchResults>
						</SearchSection>
						<CartSection>
							<h3>Shopping List</h3>
							<CartList>
								{cart.map((item, index) => (
									<CartItem key={index}>
										{item.description} - Qty: {item.quantity} - ₹
										{item.price * item.quantity}
										<DeleteButton onClick={() => handleDeleteItem(index)}>
											×
										</DeleteButton>
									</CartItem>
								))}
							</CartList>
							<DoneButton onClick={handleDoneClick}>Done</DoneButton>
						</CartSection>
						<SuggestionBox>
							<SuggestionText>{currentSuggestion}</SuggestionText>
							<SuggestionImage src="/g364.png" alt="Suggestion icon" />
						</SuggestionBox>
					</>
				)}
				{showFinalListModal && (
					<FinalListModalBackdrop>
						<FinalListModalContent>
							<FinalListTitle>Your Shopping List</FinalListTitle>
							<FinalCartList>
								{cart.map((item, index) => (
									<FinalCartItem key={index}>
										<span>
											{item.description} - Qty: {item.quantity}
										</span>
										<span>₹{item.price * item.quantity}</span>
									</FinalCartItem>
								))}
							</FinalCartList>
							<CloseButton onClick={handleCloseModal}>Close</CloseButton>
						</FinalListModalContent>
					</FinalListModalBackdrop>
				)}
			</AppContainer>
		</>
	);
}

export default App;

const AppContainer = styled.div`
	background-image: url("/rect1.png");
	background-size: cover;
	min-height: 100vh;
	color: #fff;
	display: flex;
	flex-direction: column;
	padding: 20px;
	position: relative;
`;

const Header = styled.header`
	font-family: "Poppins", sans-serif;
	padding: 20px;
	font-size: 2rem;
	font-weight: 600;
	color: white;
	text-align: center;
`;

const BudgetInfo = styled.div`
	display: flex;
	justify-content: space-between;
	background: rgba(0, 0, 0, 0.5);
	margin-top: 10px;
	padding: 15px;
	border-radius: 8px;
`;

const BudgetText = styled.p`
	margin: 0;
	font-size: 1.2rem;
	font-weight: 700;
`;

const SearchSection = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 10px;
	border-radius: 8px;
	margin: 20px 0;
`;

const SearchInput = styled.input`
	font-weight: 700;
	padding: 8px;
	border-radius: 5px;
	border: none;
	outline: none;
`;

const SearchResults = styled.ul`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: rgba(255, 255, 255, 0.75);
	color: black;
	list-style: none;
	padding: 0;
	margin: 0;
	border-radius: 5px;
	overflow-y: auto;
	max-height: 200px;
`;

const SearchResultItem = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	cursor: pointer;
	color: #000000;
	font-weight: 800;
`;

const ItemControls = styled.div`
	display: flex;
	align-items: center;
	gap: 5px;

	input {
		width: 50px;
		padding: 5px;
		text-align: center;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 5px 10px;
	}
`;

const AddButton = styled.button`
	background-color: #28a745;
	color: white;
	cursor: pointer;
	border: none;
	border-radius: 5px;
`;

const CartSection = styled.div`
	background: rgba(0, 0, 0, 0.6);
	padding: 20px;
	border-radius: 8px;
`;

const CartList = styled.ul`
	list-style: none;
	padding: 0;
`;

const CartItem = styled.li`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	font-weight: 600;
`;

const DeleteButton = styled.button`
	background: red;
	color: white;
	cursor: pointer;
	border: none;
	padding: 5px 10px;
	border-radius: 5px;
`;

const ModalBackdrop = styled.div`
	margin-top: 20px;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ModalContent = styled.div`
	background: rgba(0, 0, 0, 0.2);
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
	padding: 30px;
	border-radius: 15px;
	text-align: center;
	width: 300px;
	font-family: "Poppins", sans-serif;
`;

const ModalInput = styled.input`
	width: 90%;
	padding: 10px;
	margin-bottom: 15px;
	font-size: 1rem;
	font-family: "Poppins", sans-serif;
	border-radius: 8px;
	border: 1px solid #ccc;
	outline: none;
`;

const ModalButton = styled.button`
	width: 100%;
	padding: 10px;
	font-size: 1.1rem;
	font-weight: bold;
	background: #28a745;
	color: white;
	font-family: "Poppins", sans-serif;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	transition: background 0.3s ease;

	&:hover {
		background: #218838;
	}
`;

const SuggestionBox = styled.div`
	position: fixed;
	bottom: 20px;
	right: 20px;
	background: rgba(255, 255, 255, 0.8);
	padding: 15px;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
	gap: 10px;
	width: 300px;
`;

const SuggestionText = styled.div`
	flex: 1;
	font-size: 1rem;
	font-weight: 700;
	color: #000;
	margin: 0;
`;

const SuggestionImage = styled.img`
	position: absolute;
	right: -35px;
	bottom: -65px;
	width: 110px;
	height: 215px;
`;

const FinalListModalBackdrop = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
`;

const FinalListModalContent = styled.div`
	background: white;
	padding: 30px;
	border-radius: 15px;
	text-align: center;
	width: 90%;
	max-width: 400px;
	box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;

const FinalListTitle = styled.h2`
	margin-bottom: 20px;
	color: #333;
	font-family: "Poppins", sans-serif;
`;

const FinalCartList = styled.ul`
	list-style: none;
	padding: 0;
	max-height: 300px;
	overflow-y: auto;
	margin-bottom: 20px;
`;

const FinalCartItem = styled.li`
	display: flex;
	justify-content: space-between;
	padding: 10px;
	border-bottom: 1px solid #ddd;
	font-weight: 600;
	color: #444;
`;

const CloseButton = styled.button`
	background: #007bff;
	color: white;
	padding: 10px 20px;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-family: "Poppins", sans-serif;
	font-size: 1rem;
	font-weight: bold;

	&:hover {
		background: #0056b3;
	}
`;

const DoneButton = styled.button`
	margin-top: 10px;
	padding: 10px 20px;
	background: #28a745;
	color: white;
	border: none;
	border-radius: 8px;
	font-weight: bold;
	cursor: pointer;
	font-family: "Poppins", sans-serif;

	&:hover {
		background: #218838;
	}
`;
