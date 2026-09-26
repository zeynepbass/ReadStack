import { useState } from "react";
import { Button, ErrorText } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export default function ForgotPassword({ onRequest, onReset, onLogin, error, loading }) {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [info, setInfo] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    const data = await onRequest(email);
    if (!data) return;
    setInfo(data.message);
    if (data.resetToken) setToken(data.resetToken);
    setStep("reset");
  };

  const handleReset = (e) => {
    e.preventDefault();
    onReset({ token, password });
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-medium leading-[1.05] tracking-[-0.02em]">Şifreni yenile.</h1>
        <p className="m-0 text-base leading-normal text-muted">
          {step === "request" ? "Hesabına bağlı e-posta adresini yaz." : info}
        </p>
      </div>

      {step === "request" ? (
        <form onSubmit={handleRequest} className="flex flex-col gap-4">
          <TextField
            label="E-posta"
            type="email"
            placeholder="ornek@mail.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorText>{error}</ErrorText>
          <Button type="submit" size="2xl" disabled={loading}>
            {loading ? "Gönderiliyor…" : "Sıfırlama kodu al"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <TextField label="Sıfırlama kodu" required value={token} onChange={(e) => setToken(e.target.value)} />
          <TextField
            label="Yeni şifre"
            type="password"
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ErrorText>{error}</ErrorText>
          <Button type="submit" size="2xl" disabled={loading}>
            {loading ? "Kaydediliyor…" : "Şifreyi güncelle"}
          </Button>
        </form>
      )}

      <p className="m-0 text-sm text-muted">
        Şifreni hatırladın mı?{" "}
        <a href="#" onClick={onLogin} className="font-semibold">
          Giriş yap
        </a>
      </p>
    </div>
  );
}
