import { metadata } from '../public/data/metadata';
import { useEffect, useState } from 'react';
import { RiExpandDiagonal2Line } from 'react-icons/ri';
import { RiCollapseDiagonal2Line } from 'react-icons/ri';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IoMdAdd } from 'react-icons/io';
import Modal from './generic/Modal';
import { stateForCountries } from '../public/data/statesForCountries';
import FilterDropdown from './generic/FilterDropdown';

function Table() {
	const [countries, setCountries] = useState(
		metadata.countries.map((country) => ({
			...country,
			expanded: false,
			show: true,
			states: country.states.map((state) => ({
				...state,
				show: true,
			})),
		}))
	);
	const [newState, setNewState] = useState({
		population: '',
		area_sq_km: '',
		capital: '',
		hdi: '',
	});
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [selectedState, setSelectedState] = useState(null);

	const toggleExpand = (index) => {
		setCountries((prevCountries) =>
			prevCountries.map((country, i) =>
				i === index ? { ...country, expanded: !country.expanded } : country
			)
		);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [search]);

	useEffect(() => {
		if (debouncedSearch === '') {
			setCountries((prevCountries) =>
				prevCountries.map((country) => ({
					...country,
					expanded: false,
				}))
			);
			return;
		}

		setCountries((prevCountries) =>
			prevCountries.map((country) => {
				const hasMatchingState = country.states.some(
					(state) =>
						state.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
						state.capital.toLowerCase().includes(debouncedSearch.toLowerCase())
				);
				return {
					...country,
					expanded: hasMatchingState ? true : country.expanded,
				};
			})
		);
	}, [debouncedSearch]);

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const toggleAll = (expanded) => {
		setCountries((prevCountries) =>
			prevCountries.map((country) => ({
				...country,
				expanded: expanded,
			}))
		);
	};

	const handleCountrySelect = (event) => {
		setSelectedCountry(event.target.value);
	};

	const handleStateInputChange = (e) => {
		const { name, value } = e.target;
		setNewState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleAddState = () => {
		if (selectedCountry && selectedState) {
			setCountries((prevCountries) =>
				prevCountries.map((country) =>
					country.name === selectedCountry
						? {
								...country,
								states: [
									...country.states,
									{
										name: selectedState,
										population: parseFloat(newState.population) || 0,
										area_sq_km: parseFloat(newState.area_sq_km) || 0,
										capital: newState.capital,
										hdi: newState.hdi,
										show: true,
									},
								],
						  }
						: country
				)
			);
			setNewState({
				population: '',
				area_sq_km: '',
				capital: '',
				hdi: '',
			});
			setSelectedState(null);
			alert('State added successfully!');
		} else {
			alert('Please fill in all fields and select a country.');
		}
	};

	const handleStateSelect = (e) => {
		setSelectedState(e.target.value);
	};

	return (
		<div>
			<div className="search-bar">
				<button className="border-img" onClick={() => toggleAll(true)}>
					<RiExpandDiagonal2Line size={20} />
				</button>
				<button className="border-img" onClick={() => toggleAll(false)}>
					<RiCollapseDiagonal2Line size={20} />
				</button>
				<input
					type="text"
					placeholder="Search"
					value={search}
					onChange={handleSearch}
				/>
			</div>

			<div className="table-parent">
				<table>
					<thead>
						<tr>
							<th>Sl. No</th>
							<th>Action</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Country
									<FilterDropdown
										items={countries}
										changeState={setCountries}
										property={'name'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Country ID
									<FilterDropdown
										items={countries}
										changeState={setCountries}
										property={'country_id'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									State
									<FilterDropdown
										items={countries.map((country) => country.states).flat()}
										changeState={setCountries}
										property={'name'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Population
									<FilterDropdown
										items={countries.map((country) => country.states).flat()}
										changeState={setCountries}
										property={'population'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Area
									<FilterDropdown
										items={countries.map((country) => country.states).flat()}
										changeState={setCountries}
										property={'area_sq_km'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Currency
									<FilterDropdown
										items={countries}
										changeState={setCountries}
										property={'currency'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									Capital
									<FilterDropdown
										items={countries.map((country) => country.states).flat()}
										changeState={setCountries}
										property={'capital'}
									/>
								</div>
							</th>
							<th>
								<div className="d-flex align-items-center justify-content-between">
									HDI
									<FilterDropdown
										items={countries.map((country) => country.states).flat()}
										changeState={setCountries}
										property={'hdi'}
									/>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						{countries ? (
							countries.filter((country) => country.show).length > 0 ? (
								countries
									.filter((country) => country.show)
									.map((country, index) => (
										<>
											<tr>
												<td>{index + 1}</td>
												<td>
													<button
														className="actionbtn"
														data-bs-toggle="modal"
														data-bs-target="#actionModal"
														onClick={() => setSelectedCountry(country.name)}>
														<IoMdAdd size={20} />
													</button>
												</td>
												<td>
													<button
														onClick={() => toggleExpand(index)}
														className="no-border-img">
														{country.expanded ? (
															<MdKeyboardArrowDown size={20} />
														) : (
															<MdKeyboardArrowRight size={20} />
														)}
													</button>
													<span style={{ padding: '5px' }}>{country.name}</span>
												</td>
												<td>{country.country_id}</td>
												<td></td>
												<td>{country.population} M</td>
												<td>{country.area_sq_km} sq km</td>
												<td>{country.currency}</td>
												<td>{country.capital}</td>
												<td>{country.hdi}</td>
											</tr>
											{country.expanded &&
												country.states
													.filter((state) => state.show)
													.map((state, stateIndex) => (
														<tr
															key={`${country.name}-${state.name}-${stateIndex}`}
															className="sub-tr">
															<td></td>
															<td></td>
															<td></td>
															<td></td>
															<td>{state.name}</td>
															<td>{state.population} M</td>
															<td>{state.area_sq_km} sq km</td>
															<td>{country.currency}</td>
															<td>{state.capital}</td>
															<td>{state.hdi}</td>
														</tr>
													))}
										</>
									))
							) : (
								<p className="text-center py-3">No filter selected</p>
							)
						) : (
							<p>No records found</p>
						)}
					</tbody>
				</table>
			</div>

			<Modal
				id="actionModal"
				title="Add State"
				body={
					<>
						<select
							className="form-select form-select-sm"
							value={selectedCountry || ''}
							onChange={handleCountrySelect}>
							<option value="">Select country</option>
							{stateForCountries.map((country, index) => (
								<option value={country.country_name} key={index}>
									{country.country_name}
								</option>
							))}
						</select>
						<select
							className="form-select form-select-sm"
							value={selectedState}
							onChange={handleStateSelect}>
							<option value="">Select State</option>
							{selectedCountry &&
								stateForCountries
									.find((country) => country.country_name === selectedCountry)
									?.states.map((state, index) => (
										<option value={state} key={index}>
											{state}
										</option>
									))}
						</select>
						<input
							type="text"
							className="input-txt"
							placeholder="State Population in M"
							name="population"
							required
							value={newState.population}
							onChange={handleStateInputChange}
						/>
						<input
							type="number"
							className="input-txt"
							placeholder="State Area in sq km"
							name="area_sq_km"
							required
							value={newState.area_sq_km}
							onChange={handleStateInputChange}
						/>
						<input
							type="text"
							className="input-txt"
							placeholder="State Capital"
							name="capital"
							required
							value={newState.capital}
							onChange={handleStateInputChange}
						/>
						<input
							type="text"
							className="input-txt"
							placeholder="State HDI"
							name="hdi"
							required
							value={newState.hdi}
							onChange={handleStateInputChange}
						/>
					</>
				}
				footerButtons={[
					{
						label: 'Close',
						className: 'btn btn-secondary',
						dismiss: true,
					},
					{
						label: 'Add State',
						className: 'btn btn-primary',
						onClick: handleAddState,
					},
				]}
			/>
		</div>
	);
}

export default Table;
