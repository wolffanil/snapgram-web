import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/_auth/AuthLayout";
import { Suspense } from "react";
import { Login, Register } from "./components/_auth";
import { Loader } from "./components/ui";
import RootLayout from "./components/_root/RootLayout";
import { CreatePost, Home, Post, UpdatePost } from "./components/_root";

import "./App.css";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loader />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<Loader />}>
                <Register />
              </Suspense>
            }
          />
        </Route>

        <Route element={<RootLayout />}>
          <Route
            index
            element={
              <Suspense fallback={<Loader />}>
                <Home />
              </Suspense>
            }
          />

          <Route
            path="/create-post"
            element={
              <Suspense fallback={<Loader />}>
                <CreatePost />
              </Suspense>
            }
          />

          <Route
            path="/update-post/:id"
            element={
              <Suspense fallback={<Loader />}>
                <UpdatePost />
              </Suspense>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <Suspense fallback={<Loader />}>
                <Post />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
