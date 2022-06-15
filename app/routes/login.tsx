import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form
      className="h-full flex justify-center items-center"
      action="/auth/google"
      method="post"
    >
      <button className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition">
        Login
      </button>
    </Form>
  );
}
