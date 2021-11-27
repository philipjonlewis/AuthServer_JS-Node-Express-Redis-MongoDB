const User_Information_Schema = {
	user_id,
	user_name,
};

//project manager literally
const Project_Access_Control_Schema = {
	project_author,
	project_members: [
		{
			project_member_reference_id,
		},
	],
};

const Project_Phase_Schema = {
	project_id,
	project_name,
	project_description,
	project_phase_list: [
		{
			phase_id,
			phase_order,
			phase_name,
			phase_creation_date,
			phase_intended_completion_date,
		},
	],
};

const Date_Task_Schema = {
	date_id,
	date_expression,
	date_phase_reference_id,
	date_task_list: [
		{
			task_id,
			task_description,
			isCompleted,
			isPriority,
		},
	],
};
