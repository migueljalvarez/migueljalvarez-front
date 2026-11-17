-- 0003_views.sql — Vistas de lectura usadas por el panel (saldos y horas), para que la API no repita
-- los cálculos y el resultado coincida siempre.

-- Horas usadas por proyecto frente al presupuesto.
CREATE VIEW project_hours AS
SELECT
  p.id AS project_id,
  p.budget_hours,
  COALESCE(SUM(t.hours), 0)::numeric(10, 2) AS used_hours,
  CASE WHEN p.budget_hours > 0
       THEN round(COALESCE(SUM(t.hours), 0) / p.budget_hours * 100, 1)
       ELSE 0 END AS used_percent
FROM projects p
LEFT JOIN time_entries t ON t.project_id = p.id
GROUP BY p.id, p.budget_hours;

-- Saldo por colaborador: horas × tarifa − pagos registrados (en USD). Nunca negativo en "due_usd".
CREATE VIEW member_balances AS
SELECT
  m.id AS member_id,
  COALESCE(h.hours, 0)::numeric(10, 2) AS hours,
  (COALESCE(h.hours, 0) * m.rate_usd)::numeric(14, 2) AS earned_usd,
  COALESCE(pay.paid, 0)::numeric(14, 2) AS paid_usd,
  GREATEST(COALESCE(h.hours, 0) * m.rate_usd - COALESCE(pay.paid, 0), 0)::numeric(14, 2) AS due_usd
FROM team_members m
LEFT JOIN (
  SELECT member_id, SUM(hours) AS hours FROM time_entries GROUP BY member_id
) h ON h.member_id = m.id
LEFT JOIN (
  SELECT member_id, SUM(amount_usd) AS paid FROM payments GROUP BY member_id
) pay ON pay.member_id = m.id;

-- Horas usadas frente a las pactadas por asignación (para avisar cuando se excede lo acordado).
CREATE VIEW assignment_hours AS
SELECT
  a.id AS assignment_id,
  a.member_id,
  a.project_id,
  a.agreed_hours,
  COALESCE(SUM(t.hours), 0)::numeric(10, 2) AS used_hours,
  COALESCE(SUM(t.hours), 0) > a.agreed_hours AS exceeded
FROM assignments a
LEFT JOIN time_entries t ON t.member_id = a.member_id AND t.project_id = a.project_id
GROUP BY a.id, a.member_id, a.project_id, a.agreed_hours;
