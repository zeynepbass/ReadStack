import TextField from "./TextField";

export default function Register({ onSubmit, onLogin }) {
  return (
    <div className="flex w-full max-w-[380px] flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 font-serif text-[44px] font-medium leading-[1.05] tracking-[-0.02em]">Rafını kur.</h1>
        <p className="m-0 text-base leading-normal text-muted">Okuduklarını ve okuyacaklarını tek yerde topla.</p>
      </div>

      <div className="flex flex-col gap-4">
        <TextField label="Ad soyad" placeholder="Deniz Aydın" />
        <TextField label="E-posta" type="email" placeholder="ornek@mail.com" />
        <TextField label="Şifre" type="password" placeholder="En az 8 karakter" />
        <TextField label="Yıllık okuma hedefi" type="number" defaultValue={24} />
        <button
          onClick={onSubmit}
          className="h-12 cursor-pointer rounded-lg bg-ink text-[15px] font-semibold text-paper hover:bg-ink-hover"
        >
          Hesap oluştur
        </button>
      </div>

      <p className="m-0 text-sm text-muted">
        Zaten üye misin?{" "}
        <a href="#" onClick={onLogin} className="font-semibold">
          Giriş yap
        </a>
      </p>
    </div>
  );
}
