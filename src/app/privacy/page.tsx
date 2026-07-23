import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export const metadata = { title: "Политика конфиденциальности" };

export default function PrivacyPage() {
  return (
    <div className="bg-cream py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Политика конфиденциальности</h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-choco-soft">
          <p>
            {site.brand} обрабатывает персональные данные пользователей (имя, email, данные об оплате) исключительно
            для оказания образовательных услуг: создания личного кабинета, отправки писем о статусе заказа и
            учебных материалов.
          </p>
          <p>
            <strong className="text-choco">Какие данные собираются.</strong> Имя, email, Telegram-username (по
            желанию), сведения о заказах и прогрессе прохождения курса, технические данные (IP, user agent) для
            обеспечения безопасности аккаунта.
          </p>
          <p>
            <strong className="text-choco">Как используются данные.</strong> Для предоставления доступа к курсу,
            коммуникации по заказу, аналитики использования сервиса и улучшения продукта.
          </p>
          <p>
            <strong className="text-choco">Хранение и защита.</strong> Пароли хранятся в хешированном виде,
            платёжные данные не хранятся на нашей стороне — оплата обрабатывается сертифицированным провайдером.
          </p>
          <p>
            <strong className="text-choco">Ваши права.</strong> Вы можете запросить удаление своих данных, написав
            на {site.supportEmail}.
          </p>
        </div>
      </Container>
    </div>
  );
}
