import { useState } from "react";
import { Button, ErrorText } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export default function Login({ onSubmit, onRegister, onForgot, error, loading }) {
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-medium leading-[1.05] tracking-[-0.02em]">Tekrar hoş geldin.</h1>
        <p className="m-0 text-base leading-normal text-muted">Kaldığın sayfadan devam et.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="E-posta"
          type="email"
          placeholder="ornek@mail.com"
          autoComplete="email"
          required
          value={form.email}
          onChange={update("email")}
        />
        <TextField
          label="Şifre"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={update("password")}
        />
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" checked={form.remember} onChange={update("remember")} />
            Beni hatırla
          </label>
          <a href="#" onClick={onForgot}>
            Şifremi unuttum
          </a>
        </div>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" size="2xl" disabled={loading}>
          {loading ? "Giriş yapılıyor…" : "Giriş yap"}
        </Button>
      </form>

      <p className="m-0 text-sm text-muted">
        Hesabın yok mu?{" "}
        <a href="#" onClick={onRegister} className="font-semibold">
          Kayıt ol
        </a>
      </p>
    </div>
  );
}
