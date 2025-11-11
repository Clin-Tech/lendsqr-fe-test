import { useNavigate } from "react-router-dom";
import { useState } from "react";
import s from "./Login.module.scss";
import { Logo, SignInImg } from "../../assets/svg";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && pw) nav("/dashboard");
  };

  return (
    <div className={s.grid}>
      <section className={s.left}>
        <div className={s.logoDesktop}>
          <img src={Logo} alt="Lendsqr-logo" />
        </div>
        <div className={s.signingImg}>
          <img src={SignInImg} alt="sign-in Img" />
        </div>
      </section>
      <section className={s.right}>
        <div className={s.logoMobile}>
          <img src={Logo} alt="Lendsqr-logo" />
        </div>
        <h1 className={s.h1}>Welcome!</h1>
        <p className={s.lead}>Enter details to login.</p>

        <form onSubmit={onSubmit} className={s.form} aria-label="login form">
          <label>
            Email
            <div className={s.email}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
              />
            </div>
          </label>

          <label>
            Password
            <div className={s.password}>
              <input
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                placeholder="Password"
              />
              <button
                type="button"
                className={s.show}
                onClick={() => setShow((v) => !v)}
              >
                {show ? "HIDE" : "SHOW"}
              </button>
            </div>
          </label>

          <a href="#" onClick={(e) => e.preventDefault()} className={s.link}>
            Forgot Password?
          </a>
          <button className={s.cta} type="submit">
            LOG IN
          </button>
        </form>
      </section>
    </div>
  );
}
