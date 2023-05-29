interface IAuthPageProps {
  type: "login" | "registration";
}

interface IAuth {
  username: string;
  password: string;
}

export type { IAuthPageProps, IAuth };
