import React from "react";
import PageHeader from "../components/ui/PageHeader";

const Settings: React.FC = () => {
	return (
		<div className="bg-[#F3EEEA] p-8 min-h-screen">
			<PageHeader
				title="Profile Settings"
				description="Manage your account and profile information."
			/>
		</div>
	);
};

export default Settings;
