import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export const metadata = { title: "Публичная оферта" };

export default function OfferPage() {
  return (
    <div className="bg-cream py-16">
      <Container className="max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-choco sm:text-3xl">Публичная оферта</h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-choco-soft">
          <p>
            Настоящий документ является публичной офертой {site.brand} на заключение договора об оказании
            образовательных услуг (доступ к онлайн-курсу «{site.productName}»). Оплата заказа означает полное
            и безоговорочное принятие условий оферты.
          </p>
          <p>
            <strong className="text-choco">Предмет договора.</strong> Исполнитель предоставляет Заказчику доступ к
            видеоурокам, PDF-материалам и сопутствующим бонусам в личном кабинете на условиях выбранного тарифа.
          </p>
          <p>
            <strong className="text-choco">Стоимость и оплата.</strong> Стоимость указывается на сайте на момент
            оформления заказа. Оплата производится безналичным способом через платёжного провайдера.
          </p>
          <p>
            <strong className="text-choco">Возврат средств.</strong> Заказчик вправе запросить полный возврат в
            течение 14 дней с момента оплаты, написав в поддержку: {site.supportEmail}.
          </p>
          <p>
            <strong className="text-choco">Доступ.</strong> Доступ к материалам предоставляется на неограниченный
            срок с момента подтверждения оплаты.
          </p>
          <p>По всем вопросам обращайтесь: {site.supportEmail}.</p>
        </div>
      </Container>
    </div>
  );
}
