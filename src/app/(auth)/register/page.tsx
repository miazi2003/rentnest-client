import RegisterForm from "@/app/features/auth/components/registerForm";
import Image from "next/image";

export default function RegisterPage() {
  const heroImageSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 1200' width='100%' height='100%'><defs><linearGradient id='bgGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23090A0F'/><stop offset='40%' stop-color='%23171216'/><stop offset='80%' stop-color='%232A160C'/><stop offset='100%' stop-color='%23451A03'/></linearGradient><radialGradient id='orangeGlow' cx='50%' cy='45%' r='50%'><stop offset='0%' stop-color='%23F97316' stop-opacity='0.6'/><stop offset='30%' stop-color='%23EA580C' stop-opacity='0.35'/><stop offset='70%' stop-color='%239A3412' stop-opacity='0.15'/><stop offset='100%' stop-color='%23000000' stop-opacity='0'/></radialGradient><radialGradient id='houseGlow' cx='50%' cy='40%' r='30%'><stop offset='0%' stop-color='%23FBBF24' stop-opacity='0.7'/><stop offset='50%' stop-color='%23F59E0B' stop-opacity='0.3'/><stop offset='100%' stop-color='%23D97706' stop-opacity='0'/></radialGradient><linearGradient id='glassGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FEF3C7' stop-opacity='0.9'/><stop offset='100%' stop-color='%23FDE047' stop-opacity='0.6'/></linearGradient><linearGradient id='wallGrad' x1='0%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='%23334155'/><stop offset='100%' stop-color='%230F172A'/></linearGradient><linearGradient id='handGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23D97706' stop-opacity='0.4'/><stop offset='50%' stop-color='%237C2D12' stop-opacity='0.6'/><stop offset='100%' stop-color='%231C1917' stop-opacity='0.9'/></linearGradient></defs><rect width='1000' height='1200' fill='url(%23bgGrad)'/><circle cx='500' cy='520' r='420' fill='url(%23orangeGlow)'/><circle cx='500' cy='480' r='250' fill='url(%23houseGlow)'/><circle cx='300' cy='400' r='3' fill='%23FDE047' opacity='0.6'/><circle cx='700' cy='350' r='4' fill='%23F97316' opacity='0.8'/><circle cx='250' cy='600' r='2' fill='%23FBBF24' opacity='0.5'/><circle cx='750' cy='580' r='3' fill='%23FDE047' opacity='0.7'/><circle cx='420' cy='300' r='2' fill='%23FFFFFF' opacity='0.9'/><circle cx='620' cy='280' r='3' fill='%23FBBF24' opacity='0.8'/><g id='hand' transform='translate(0, 100)'><path d='M360,1050 C380,880 400,800 420,760 C440,735 480,725 500,725 C520,725 560,735 580,760 C600,800 620,880 640,1050 Z' fill='url(%23handGrad)' opacity='0.85'/><path d='M 280,750 Q 500,790 720,750 Q 750,770 710,810 Q 500,860 290,810 Q 250,770 280,750 Z' fill='%23292524' opacity='0.9'/><path d='M 270,740 C 230,710 240,650 280,630 C 300,645 310,680 320,730 Z' fill='%2344403C' opacity='0.8'/><path d='M 275,735 C 245,710 252,660 280,642' stroke='%23F97316' stroke-width='3' fill='none' opacity='0.7'/><path d='M 350,730 C 340,640 370,570 400,560 C 420,575 410,640 400,730 Z' fill='%233D3835' opacity='0.75'/><path d='M 355,720 C 348,645 372,580 398,568' stroke='%23F59E0B' stroke-width='2.5' fill='none' opacity='0.8'/><path d='M 450,725 C 450,620 480,550 510,545 C 525,560 515,630 500,725 Z' fill='%232A2725' opacity='0.7'/><path d='M 580,730 C 590,630 620,570 645,580 C 655,595 640,650 620,730 Z' fill='%233D3835' opacity='0.75'/><path d='M 585,720 C 595,635 622,582 642,590' stroke='%23F97316' stroke-width='2.5' fill='none' opacity='0.7'/><path d='M 660,740 C 700,670 740,650 760,670 C 750,700 710,740 680,750 Z' fill='%2344403C' opacity='0.8'/><path d='M 665,735 C 700,675 735,660 752,675' stroke='%23F97316' stroke-width='3' fill='none' opacity='0.7'/><path d='M 280,745 Q 500,785 720,745' stroke='%23F97316' stroke-width='4' fill='none' opacity='0.85'/></g><g id='luxuryHouse' transform='translate(0, -20)'><ellipse cx='500' cy='740' rx='210' ry='35' fill='%23000000' opacity='0.6'/><ellipse cx='500' cy='738' rx='190' ry='25' fill='%23EA580C' opacity='0.4'/><polygon points='310,720 500,745 690,720 500,695' fill='%231E293B'/><polygon points='310,720 500,745 500,752 310,727' fill='%230F172A'/><polygon points='500,745 690,720 690,727 500,752' fill='%23334155'/><polygon points='310,720 500,745 690,720 500,743' stroke='%23FBBF24' stroke-width='2' fill='none' opacity='0.9'/><polygon points='340,700 480,720 480,560 340,545' fill='url(%23wallGrad)'/><polygon points='355,685 465,702 465,575 355,560' fill='url(%23glassGrad)'/><line x1='410' y1='568' x2='410' y2='693' stroke='%231E293B' stroke-width='3'/><line x1='355' y1='622' x2='465' y2='638' stroke='%231E293B' stroke-width='3'/><polygon points='470,725 660,700 660,500 470,520' fill='%230F172A'/><polygon points='485,705 645,683 645,515 485,532' fill='url(%23glassGrad)'/><line x1='565' y1='523' x2='565' y2='694' stroke='%230F172A' stroke-width='4'/><line x1='485' y1='610' x2='645' y2='590' stroke='%230F172A' stroke-width='3'/><polygon points='310,540 520,565 710,535 500,510' fill='%23475569'/><polygon points='310,540 520,565 520,572 310,547' fill='%231E293B'/><polygon points='520,565 710,535 710,542 520,572' fill='%2364748B'/><polygon points='420,510 580,522 580,440 420,430' fill='%231E293B'/><polygon points='430,498 570,508 570,448 430,440' fill='url(%23glassGrad)'/><polygon points='380,430 620,445 640,425 400,410' fill='%23F97316'/><polygon points='380,430 620,445 620,450 380,435' fill='%23C2410C'/><rect x='500' y='630' width='30' height='40' fill='%2378350F' rx='3' opacity='0.7'/><circle cx='515' cy='615' r='10' fill='%23F59E0B' opacity='0.9'/><polygon points='440,735 560,748 530,765 410,750' fill='%230284C7' opacity='0.75'/><polygon points='440,735 560,748 530,765 410,750' stroke='%2338BDF8' stroke-width='1.5' fill='none' opacity='0.9'/><polygon points='500,600 200,300 350,250' fill='%23F59E0B' opacity='0.08'/><polygon points='500,600 650,220 800,280' fill='%23F97316' opacity='0.08'/></g></svg>`;

  const logoSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='24' fill='%230F172A'/><path d='M30 68V48L50 32L70 48V68C70 70.2091 68.2091 72 66 72H34C31.7909 72 30 70.2091 30 68Z' stroke='%23F97316' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><path d='M44 72V56H56V72' stroke='%23F97316' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/><circle cx='50' cy='24' r='4' fill='%23F59E0B'/></svg>`;

  return (
    <main className="min-h-screen w-full  flex items-center justify-center p-4 sm:p-6 lg:p-6 font-sans">
      <div className="w-full max-w-[1220px] bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden p-3 sm:p-4 flex flex-col lg:flex-row-reverse min-h-[640px]">
        {/* LEFT COLUMN - HERO SECTION (48%) */}
        <div className="relative w-full lg:w-[48%] min-h-[420px] sm:min-h-[500px] lg:min-h-[640px] rounded-[24px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 lg:p-12">
          <Image
            src={heroImageSvg}
            alt="Luxury modern house on open hand"
            fill
            priority
            sizes="(max-width:768px) 100vw, 48vw"
            className="object-cover"
          />

          {/* Black to warm orange gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 pointer-events-none" />

          {/* Top Left Heading */}
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.15] tracking-tight">
              Find Your Perfect
              <br />
              Property Today
            </h1>
          </div>
        </div>

        {/* RIGHT COLUMN - CONTENT & SLOT (52%) */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          {/* Logo Placeholder (48x48) */}
          <div className="w-[48px] h-[48px] relative mb-10">
            <Image
              src={logoSvg}
              alt="Logo"
              width={48}
              height={48}
              priority
              className="object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight mb-4">
            Create New Account
          </h2>

        

          {/* Placeholder for Login Form */}
          <div className="w-full">
            <RegisterForm/>
          </div>
        </div>
      </div>
    </main>
  );
}
