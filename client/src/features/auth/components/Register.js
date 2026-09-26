import { useState } from "react";
import { Button, ErrorText } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export default function Register({ onSubmit, onLogin, error, loading }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", goal: 24 });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, goal: Number(form.goal) || 24 });
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-medium leading-[1.05] tracking-[-0.02em]">Rafını kur.</h1>
        <p className="m-0 text-base leading-normal text-muted">Okuduklarını ve okuyacaklarını tek yerde topla.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Ad soyad" placeholder="Deniz Aydın" autoComplete="name" required value={form.name} onChange={update("name")} />
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
          placeholder="En az 8 karakter"
          autoComplete="new-password"
          minLength={8}
          required
          value={form.password}
          onChange={update("password")}
        />
        <TextField label="Yıllık okuma hedefi" type="number" min={1} value={form.goal} onChange={update("goal")} />
        <ErrorText>{error}</ErrorText>
        <Button type="submit" size="2xl" disabled={loading}>
          {loading ? "Hesap oluşturuluyor…" : "Hesap oluştur"}
        </Button>
      </form>

      <p className="m-0 text-sm text-muted">
        Zaten üye misin?{" "}
        <a href="#" onClick={onLogin} className="font-semibold">
          Giriş yap
        </a>
      </p>
    </div>
  );
}
