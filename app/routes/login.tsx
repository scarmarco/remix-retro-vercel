import { Form } from "@remix-run/react";
import Layout from "~/components/Layout";

export default function Login() {
  return (
    <Layout hideLogin>
      <Form
        className="h-full flex justify-center items-center"
        action="/auth/google"
        method="post"
      >
        <button className="bg-white hover:ring ring-black text-black text-center py-2 px-4 rounded-lg border transition">
          Login with Google
        </button>
      </Form>
    </Layout>
  );
}
