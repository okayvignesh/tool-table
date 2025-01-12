import React from 'react';

const Modal = ({ id, title, body, footerButtons }) => {
	return (
		<>
			<div
				className="modal fade"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				id={id}
				tabIndex="-1"
				aria-labelledby={`${id}Label`}
				aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id={`${id}Label`}>
								{title}
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body">{body}</div>
						<div className="modal-footer">
							{footerButtons.map((button, index) => (
								<button
									key={index}
									type={button.type || 'button'}
									className={button.className}
									data-bs-dismiss={button.dismiss ? 'modal' : undefined}
									onClick={button.onClick}>
									{button.label}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;
