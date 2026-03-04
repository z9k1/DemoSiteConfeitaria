"use client";

import { FormEvent, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type LeadFormProps = {
  sourcePage: string;
};

type FormState = {
  name: string;
  phone: string;
  event_type: string;
  date: string;
  guest_count: string;
  budget_range: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  event_type: "",
  date: "",
  guest_count: "",
  budget_range: "",
  notes: ""
};

export function LeadForm({ sourcePage }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const budgetFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
    []
  );

  const formatBudgetInput = useMemo(
    () => (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "";
      return budgetFormatter.format(Number(digits));
    },
    [budgetFormatter]
  );

  const formattedBudget = useMemo(() => {
    const digits = form.budget_range.replace(/\D/g, "");
    if (!digits) return "";
    return budgetFormatter.format(Number(digits));
  }, [form.budget_range, budgetFormatter]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const whatsappMessage = [
      "Olá! Quero solicitar orçamento para evento.",
      `Origem: ${sourcePage}`,
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Tipo de evento: ${form.event_type}`,
      `Data: ${form.date || "Não informado"}`,
      `Convidados: ${form.guest_count || "Não informado"}`,
      `Faixa de investimento: ${formattedBudget || "Não informado"}`,
      `Detalhes: ${form.notes || "Não informado"}`
    ].join("\n");

    trackEvent("click_whatsapp", { source_page: sourcePage, event_type: form.event_type });
    window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
    setStatus("success");
    setForm(initialState);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 w-full max-w-5xl rounded-none border-0 bg-transparent p-0 shadow-none"
    >
      <h3 className="font-serifBrand text-2xl text-cocoa-800">Briefing rápido do evento</h3>
        <p className="text-sm text-cocoa-700">
          Preencha os campos principais para receber seu orçamento personalizado.
        </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Nome"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
        />
        <input
          required
          placeholder="WhatsApp"
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          className="rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-1 pt-6">
          <label
            htmlFor="event-type"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500"
          >
            Selecionar tipo de evento
          </label>
          <input
            id="event-type"
            required
            placeholder="Tipo de evento"
            value={form.event_type}
            onChange={(e) => setForm((prev) => ({ ...prev, event_type: e.target.value }))}
            className="h-12 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-cocoa-800">Data da Retirada / Evento</label>
          <input
            type="date"
            value={form.date}
            placeholder="Quando você precisa do pedido?"
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            className="h-12 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
          />
          <p className="text-xs text-cocoa-700">Lembre-se: pedidos com no mínimo 5 dias de antecedência.</p>
        </div>
        <div className="flex flex-col gap-1 pt-6">
          <label
            htmlFor="guest-count"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500"
          >
            Quantidade de convidados
          </label>
          <input
            id="guest-count"
            placeholder="Qtd. convidados"
            value={form.guest_count}
            onChange={(e) => setForm((prev) => ({ ...prev, guest_count: e.target.value }))}
            className="min-w-[150px] h-12 w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-cocoa-700/40 focus:ring"
          />
        </div>
      </div>

      <input
        placeholder="Faixa de investimento (opcional)"
        value={form.budget_range}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, budget_range: formatBudgetInput(e.target.value) }))
        }
        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
      />

      <textarea
        rows={4}
        placeholder="Detalhes do pedido, personalização e observações"
        value={form.notes}
        onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-cocoa-700/40 focus:ring"
      />

      <button
        type="submit"
        className="w-full rounded-full bg-cocoa-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cocoa-800 disabled:opacity-60"
      >
        Enviar briefing no WhatsApp
      </button>

      {status === "success" ? (
        <p className="text-sm text-cocoa-700">Abrimos o WhatsApp com o briefing preenchido.</p>
      ) : null}
    </form>
  );
}
