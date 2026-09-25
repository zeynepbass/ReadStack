import { Button } from "@/shared/components/atoms";
import { TextField } from "@/shared/components/molecules";

export default function Login({ onSubmit, onRegister }) {
  return (
    <div className="flex w-full max-w-[380px] flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-medium leading-[1.05] tracking-[-0.02em]">Tekrar hoş geldin.</h1>
        <p className="m-0 text-base leading-normal text-muted">Kaldığın sayfadan devam et.</p>
      </div>

      <div className="flex flex-col gap-4">
        <TextField label="E-posta" type="email" placeholder="ornek@mail.com" />
        <TextField label="Şifre" type="password" placeholder="••••••••" />
        <div className="flex items-center justify-between text-[13px]">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" defaultChecked />
            Beni hatırla
          </label>
          <a href="#">Şifremi unuttum</a>
        </div>
        <Button size="2xl" onClick={onSubmit}>
          Giriş yap
        </Button>
      </div>

      <p className="m-0 text-sm text-muted">
        Hesabın yok mu?{" "}
        <a href="#" onClick={onRegister} className="font-semibold">
          Kayıt ol
        </a>
      </p>
    </div>
  );
}
