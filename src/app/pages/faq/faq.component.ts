import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { config } from '../../shared/config';
import { FaqSection } from '../../shared/interfaces/faq.interface';

const FAQ_SECTIONS: FaqSection[] = [
  {
    title: 'Orders & Shipping',
    items: [
      {
        question: 'How long will my order take to arrive?',
        answer:
          'Orders placed before 2pm on a business day are packed the same day. Standard delivery arrives in 3–5 business days, and express delivery in 1–2 business days. Remote areas may take a little longer.',
      },
      {
        question: 'How much does shipping cost?',
        answer:
          'Standard shipping is free on every order over $75. Below that it is a flat $10, and express shipping is $18 regardless of order value.',
      },
      {
        question: 'Can I track my order?',
        answer:
          'Yes. As soon as your parcel leaves our warehouse you will get an email with a tracking link. You can also see the current status of every order under Pending Orders on your account page.',
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'We currently ship to the United States, Canada, the United Kingdom and the EU. Duties and import taxes for orders outside the US are calculated at checkout so there is nothing to pay on delivery.',
      },
      {
        question: 'Can I change or cancel my order after placing it?',
        answer:
          'We can change or cancel an order any time before it is packed — usually a window of a few hours. Contact the support centre with your order number and we will do our best to catch it before it ships.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return policy?',
        answer:
          'Unworn items in their original packaging can be returned within 30 days of delivery for a full refund. Items marked final sale, along with pierced jewellery, cannot be returned for hygiene reasons.',
      },
      {
        question: 'How do I start a return?',
        answer:
          'Email us with your order number and the items you would like to send back. We will reply with a prepaid return label and instructions — returns are free within the US.',
      },
      {
        question: 'When will I get my refund?',
        answer:
          'Refunds are issued to the original payment method within 3–5 business days of your return reaching our warehouse. Your bank may take a further few days to display it.',
      },
      {
        question: 'Can I exchange an item for a different size?',
        answer:
          'Yes. Start a return for the item you have and place a new order for the size you want — that way the size you need is reserved for you straight away rather than waiting for the return to be processed.',
      },
    ],
  },
  {
    title: 'Payment & Pricing',
    items: [
      {
        question: 'Which payment methods do you accept?',
        answer:
          'We accept Visa, Mastercard and American Express. Your card is only charged once your order has been confirmed.',
      },
      {
        question: 'Is it safe to use my card on this site?',
        answer:
          'Card details are sent straight to our payment processor over an encrypted connection and are never stored on our own servers. We never see or keep your full card number.',
      },
      {
        question: 'Do you price match or offer student discounts?',
        answer:
          'We do not price match, but seasonal sales run several times a year and discount codes can be applied in the order summary at checkout. One code can be used per order.',
      },
    ],
  },
  {
    title: 'Account & Support',
    items: [
      {
        question: 'Do I need an account to place an order?',
        answer:
          'An account is required to add items to your cart and check out. It also lets you follow your orders and keeps your delivery details ready for next time.',
      },
      {
        question: 'I forgot my password — what now?',
        answer:
          'Use the "Forget Password?" link on the sign-in page and we will email you a reset link. If it does not arrive within a few minutes, check your spam folder before getting in touch.',
      },
      {
        question: 'How do I get in touch with a real person?',
        answer: `Our team is available ${config.support.hours} on ${config.support.phone}, or you can send a message from the support centre and we will reply ${config.support.responseTime}.`,
      },
    ],
  },
];

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  protected readonly sections = FAQ_SECTIONS;
  protected readonly supportEmail = config.support.email;

  private readonly openQuestion = signal<string | null>(null);

  protected isOpen(question: string): boolean {
    return this.openQuestion() === question;
  }

  protected toggle(question: string): void {
    this.openQuestion.update((open) => (open === question ? null : question));
  }
}
