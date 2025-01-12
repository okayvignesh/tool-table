import React, { useState, useEffect } from 'react';
import { MdFilterList } from 'react-icons/md';

const FilterDropdown = ({
	items,
	property,
	changeState,
	hasChildren,
	childKey,
}) => {
	const [selectAll, setSelectAll] = useState(true);

	const handleCheckboxChange = (item) => {
		changeState((prev) => {
			return prev.map((country) => {
				if (country === item) {
					return {
						...country,
						show: !country.show,
						states: country.states.map((state) => ({
							...state,
							show: !country.show,
						})),
					};
				}
				if (country.states && country.show) {
					return {
						...country,
						states: country.states.map((state) => {
							if (state === item) {
								return {
									...state,
									show: !state.show,
								};
							}
							return state;
						}),
					};
				}
				return country;
			});
		});
	};

	const handleSelectAll = () => {
		const newSelectAll = !selectAll;
		setSelectAll(newSelectAll);

		changeState((prev) => {
			return prev.map((country) => {
				return {
					...country,
					show: newSelectAll,
					states: country.states.map((state) => ({
						...state,
						show: newSelectAll,
					})),
				};
			});
		});
	};

	return (
		<div className="dropdown">
			<button
				className="filterbtn"
				type="button"
				data-bs-auto-close="outside"
				data-bs-toggle="dropdown"
				aria-expanded="false">
				<MdFilterList size={25} />
			</button>
			<div className="dropdown-menu p-2" style={{ minWidth: '200px' }}>
				<ul className="list-unstyled">
					<li className="mb-2">
						<input
							type="checkbox"
							id={`checkbox-all`}
							checked={selectAll}
							onChange={handleSelectAll}
							className="form-check-input me-2"
						/>
						<label htmlFor={`checkbox-all`} className="form-check-label">
							Select All
						</label>
					</li>
					{items.map((item, index) => (
						<>
							<li key={index} className="mb-2">
								<input
									type="checkbox"
									id={`checkbox-${index}`}
									checked={item.show}
									onChange={() => handleCheckboxChange(item)}
									className="form-check-input me-2"
								/>
								<label
									htmlFor={`checkbox-${index}`}
									className="form-check-label">
									{item[property]}
								</label>
							</li>
							{hasChildren &&
								item[childKey] &&
								item[childKey].map((child, childIndex) => {
									return (
										<li
											key={`${item.name}-${child.name}-${childIndex}`}
											className="mb-2 ms-3">
											<input
												type="checkbox"
												id={`checkbox-${item.name}-${child.name}-${childIndex}`}
												checked={child.show}
												onChange={() => handleCheckboxChange(child)}
												className="form-check-input me-2"
											/>
											<label
												htmlFor={`checkbox-${item.name}-${child.name}-${childIndex}`}
												className="form-check-label">
												{child[property]}
											</label>
										</li>
									);
								})}
						</>
					))}
				</ul>
			</div>
		</div>
	);
};

export default FilterDropdown;
