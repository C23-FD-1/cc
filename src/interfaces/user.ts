export interface CreateUser {
	name: string | null;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface UpdateUser {
	id: number;
	name: string | null;
	email: string;
}
