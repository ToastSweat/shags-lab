# NetSuite / Jira Ticket Workflow — Trial Draft (v2)

> **Status:** Working draft for day-to-day use and refinement  
> **Trial started:** October 20, 2026  
> **Purpose:** A consistent way to take a Jira ticket from intake through testing, release, and closure without losing ownership, evidence, or approvals.

## Quick reference

**Normal path for a code change:**  
`To Do → In Progress → Code Review → Stakeholder Review → Awaiting CAB Approval → Ready for Release → Done`

**Other paths:**

- **Blocked:** Move to `Blocked` only if the outstanding dependency prevents useful progress. Return to `In Progress` when the blocker is resolved. Note in Jira.
- **Review failure:** Return from `Code Review` or `Stakeholder Review` to `In Progress`, fix, retest, and resubmit for the necessary reviews.
- **No code to review:** Configuration-only changes may bypass `Code Review` when no technical peer review is required; document the reason.
- **CAB not required:** If a Production deployment is needed but CAB is not applicable under team policy, proceed from UAT/technical approval directly to `Ready for Release`. Document why CAB did not apply.
- **No deployment:** Investigation, documentation, or validation of existing behavior can go from `In Progress` (or `Stakeholder Review`, if business confirmation is needed) to `Done`. Do not create a CAB entry or production release for work that is not being deployed.
- **Canceled:** A withdrawn, duplicate, or superseded ticket goes to `Canceled` with an explanation.
- **To Do:** If a ticket is returned to `To Do`, comment with the required `/status` update.

### Jira status and comment rule

**Every transition into a status other than `In Progress` requires a Jira `/status` comment.** Do this as part of the transition, not later.

**Pattern:** `/status <Status Label> <concise explanation / next step>`

| Jira status | `/status` comment? | What the update should capture |
|---|---|---|
| To Do | **Yes** | Why work is being returned to the queue |
| In Progress | **No** | No required `/status` comment |
| Blocked | **Yes** | Specific blocker, owner/dependency, next step, work completed |
| Code Review | **Yes** | PR/change summary, internal test results, reviewer request |
| Stakeholder Review | **Yes** | Business UAT owner, test kit, environment, approval request |
| Awaiting CAB Approval | **Yes** | Submitted CAB request, change scope, true business UAT approver, review date/window, approval pending |
| Ready for Release | **Yes** | All applicable approvals, including CAB approval when required; correct Jira Fix Version and deployment readiness |
| Canceled | **Yes** | Why the work was canceled/superseded |
| Done | **Yes** | What was completed, Production validation or no-deploy conclusion |

> **Note:** `/status` is a team commenting convention. Use your team's exact Jira editor syntax if it formats the label differently. **`Awaiting CAB Approval` means submitted for CAB review, not approved or authorized to deploy. `Ready for Release` follows CAB approval where CAB is required.**

## Phase 1 — Pick up ticket and establish ownership

**Jira status:** `To Do → In Progress` (no `/status` comment required for `In Progress`)

- [ ] Read the full ticket: description, acceptance criteria, comments, links, documentation, and relevant history.
- [ ] Set the issue to **In Progress** when actually beginning work.
- [ ] **Check business UAT ownership immediately.** Is a *named business-side person* identified who will perform UAT and provide sign-off?
  - [ ] If missing or a technical coordinator/reporter is listed instead, ask on Jira **before diving into implementation**.
  - [ ] Identify the actual tester, not merely the person who brought the request to IT (e.g., don't automatically use Lasse, David, Daniel, Krista, or Alfonso as the business tester/requestor).
  - [ ] If business UAT is genuinely not applicable, document why.
- [ ] Check scope/permissions/requirements: what behavior is expected, which roles/subsidiaries/environments are involved, and what external dependencies exist?
- [ ] Ask outstanding questions promptly; continue independent investigation, planning, or development where practical.
- [ ] If no useful work can proceed, move to **Blocked** and leave the required `/status Blocked ...` comment.

**Suggested UAT ownership comment (ordinary Jira comment, not a status transition):**  
"Before I get started, can we confirm who on the business side will perform UAT and provide final sign-off? I want to make sure the right tester is identified from the beginning."

**Exit:** Scope understood sufficiently to proceed; missing UAT owner and open questions have been requested and tracked.

## Phase 2 — Plan implementation and attach a release early

**Jira status:** `In Progress`

- [ ] Classify the ticket: NetSuite repository code/SDF, NetSuite configuration, master data, Azure service, investigation, or no-change verification.
- [ ] Decide whether there is an actual **Production change**. If not, use the no-deployment path.
- [ ] Identify existing functionality and dependencies before changing it. Confirm the smallest change that meets the request.
- [ ] Identify required tests, roles, test records, regression areas, integrations, risk, and a realistic back-out approach.
- [ ] **Assign the Jira Fix Version / Release during planning** rather than waiting until UAT.

### Jira release conventions (from Bryce)

| Work released | Jira release approach |
|---|---|
| NetSuite repository changes **only** | `vYYYY.M.D.n[f/e/F]` (example: `v2026.11.24.1e` for Italy/Switzerland NetSuite code) |
| Azure service image changes **only** | Service/semantic version |
| NetSuite configuration, records, and master-data imports | Named release, e.g. `Global ERP: Italy/Switzerland NetSuite Configuration` |
| Production release date unknown | Project-specific placeholder, e.g. `LaserAway NetSuite: SDF` |

- [ ] If the desired dated release does not exist, create it for the **Tuesday on which deployment is planned**. If timing is unknown, use a project placeholder and revise later.
- [ ] Keep the Jira release assignment current if scope or deployment timing changes.
- [ ] Remember: **release assignment is tracking, not permission to deploy**.

**Exit:** Implementation/test/rollback direction and the appropriate Jira release are identified, or a clearly documented reason is given for no release.

## Phase 3 — Develop and run your own tests

**Jira status:** `In Progress`, or `Blocked` if progress actually stops

- [ ] For code changes, create a ticket-specific branch and maintain appropriate source control/SDF objects. For configuration-only work, capture a reliable configuration change record.
- [ ] Implement only approved scope; preserve established behavior unless the requirement explicitly changes it.
- [ ] Develop in the appropriate sandbox; do not assume an unverified environment, permission, or account ID.
- [ ] If questions block only part of the work, document them and continue the unblocked work.
- [ ] Perform **developer testing** (not business UAT):
  - [ ] Acceptance-criteria/functional testing
  - [ ] Regression testing of existing behavior
  - [ ] Negative and boundary cases
  - [ ] Relevant permissions/role testing
  - [ ] Integration/dependency checks where appropriate
- [ ] Create missing test data if needed; record the test customer/item/order IDs used.
- [ ] Capture results: expected vs. actual, relevant screenshots, record IDs, execution logs, and known limitations.
- [ ] Fix defects and rerun affected tests before review.

**Exit:** Internal testing passes with reproducible evidence.

## Phase 4 — Technical review and business UAT package

### Technical/code review (when applicable)

**Jira status:** `Code Review` + `/status Code Review ...` comment

- [ ] Commit/push, open PR, list changed scripts/objects, and describe what changed and why.
- [ ] Attach or link internal test evidence and known risks.
- [ ] Request peer review; respond to findings and retest as required.
- [ ] Obtain required technical approval before the associated Production release.

**Example:**  
`/status Code Review Implementation and sandbox/regression testing are complete. PR [link] is ready for review; test evidence: [records/results].`

### Prepare the business UAT test kit

- [ ] Briefly explain the request and changed behavior, without assuming the tester knows the technical details.
- [ ] Identify the exact sandbox and the business role/access needed.
- [ ] Provide test customers, transactions, or instructions to create them.
- [ ] Provide step-by-step positive, negative, and relevant regression scenarios, each with expected results.
- [ ] Call out prerequisites, known limits, and any areas requiring special attention.
- [ ] Explain where to report failures and **explicitly ask for business sign-off**.
- [ ] Confirm the tester can access the sandbox and has everything needed.

> **Ordering:** Technical review and UAT-kit preparation can overlap. Business UAT should test the candidate version intended for release. If fixes occur later, repeat affected testing and review.

## Phase 5 — Business UAT and sign-off

**Jira status:** `Stakeholder Review` + `/status Stakeholder Review ...` comment

- [ ] Send the test kit to the **named business UAT owner**; link it in Jira.
- [ ] Provide the exact environment, test data, and required scenarios.
- [ ] Record test results and who actually performed UAT.
- [ ] If tests fail, return to `In Progress` (no required `/status` comment), correct the issue, repeat internal tests, and resubmit affected UAT cases.
- [ ] If progress is impossible due to an external dependency, use `Blocked` with a `/status` explanation.
- [ ] Obtain **explicit business approval** in Jira or an attributable record and note the approver and date.
- [ ] For no-change verification tickets, business validation may be the last gate before `Done` (no production release/CAB).

**Example:**  
`/status Stakeholder Review Sandbox implementation and developer regression testing passed. [Business UAT owner], please complete the attached test scenarios in [sandbox] and confirm sign-off.`

**Exit:** UAT passed and the actual business owner provided sign-off, or there is a documented reason business UAT is not applicable.

## Phase 6 — CAB approval, release readiness, and deployment

### CAB preparation and submission (when required)

**Jira status:** `Awaiting CAB Approval` + `/status Awaiting CAB Approval ...` comment **once the CAB request has been submitted**

- [ ] Verify business UAT sign-off and required technical review status, noting anything still pending.
- [ ] Confirm the **actual business-side UAT tester/sign-off contact** for the CAB form; do not automatically substitute the Jira reporter or a coordinating IT/project contact.
- [ ] Confirm the Jira Fix Version, intended production scope, release dependencies, target window (or `TBD`), and realistic back-out plan.
- [ ] Prepare and submit the CAB request with change description, business justification, alternatives, risk/impact, affected systems, UAT owner, testing evidence, implementation plan, and contingency/back-out steps.
  - CAB can be submitted **early for upcoming-change visibility**. State clearly if development, code review, business UAT, or the implementation date is not yet complete/confirmed.
  - Submit a single coordinated CAB entry for logically related rollout changes when appropriate; reference all related Jira tickets.
- [ ] **Transition to `Awaiting CAB Approval` when CAB is submitted**, with a `/status` comment documenting the submitted request, approval still pending, and any remaining prerequisites.
- [ ] Address CAB questions or requested changes. If they require new development, return to `In Progress`, re-test/review, and update the CAB entry as needed.
- [ ] **Do not deploy merely because the ticket is in `Awaiting CAB Approval`.** Approval must be explicitly received and recorded.

**Example:**  
`/status Awaiting CAB Approval CAB request [link] submitted for [scope/release]. Business UAT: [approver and outcome or pending]. Target [date/TBD]; waiting for CAB review/approval before Production deployment.`

**If CAB is not required:** Record the exemption/decision in Jira; do not transition into `Awaiting CAB Approval` solely for bookkeeping.

### Release ready (after required approvals)

**Jira status:** `Ready for Release` + `/status Ready for Release ...` comment

- [ ] Confirm CAB approval (if applicable) and record its approval reference/date.
- [ ] Confirm required UAT and technical approvals are complete, and the version to deploy matches what was approved/tested.
- [ ] Finalize the Jira Fix Version, deployment date/time, sequence, affected systems, release owner, dependencies, and back-out instructions.
- [ ] Move to **Ready for Release** only when the change is actually cleared for the planned production release.

**Example:**  
`/status Ready for Release Business UAT approved by [name] on [date], technical review completed, CAB [approved reference/not required]. Scheduled for [release/date]; deployment and back-out steps confirmed.`

### Production deployment

**Jira status:** normally remains `Ready for Release` until successful post-deployment verification, then `Done`

- [ ] Deploy only the approved changes in the planned release/window.
- [ ] Record what was deployed, when, by whom, and under which Jira release/CAB reference.
- [ ] If deployment is postponed before it starts, update the release date and ticket/CAB notes; recheck approvals if the change or window changes.
- [ ] If a production issue arises, stop and follow the approved recovery/back-out path; move to `In Progress` or `Blocked` as appropriate (`/status Blocked ...` required for `Blocked`).

**Exit:** Production deployment completes, or the attempted release is paused/rolled back with a documented disposition.

## Phase 7 — Production validation and close

**Jira status:** `Done` + `/status Done ...` comment

- [ ] Perform appropriate post-deployment smoke testing and monitor logs/integrations for unexpected behavior.
- [ ] Validate affected records/roles and basic regression behavior without introducing unnecessary Production changes.
- [ ] If deployment fails or breaks behavior, follow the back-out plan, document impact, and return to the appropriate active/blocked status.
- [ ] Capture Production test evidence, release version, CAB/PR links, and any follow-up tickets.
- [ ] Confirm completion and move to `Done` with the required `/status Done ...` comment.
- [ ] If **no Production change was needed**, clearly say so in the `Done` comment; do not imply a deployment happened.

**Examples:**  
`/status Done Deployed [change] to Production in [release] on [date]. Smoke testing passed: [records/results]. CAB: [link].`  
`/status Done Verified existing behavior satisfies the requirement; [test evidence/business confirmation]. No code or configuration changes and no Production deployment required.`

## Exceptional paths

### Blocked

- Move to `Blocked` only when useful work cannot continue, not merely because one question is still open.
- Leave `/status Blocked ...` identifying **what**, **who**, and **what is needed next**.
- Return to `In Progress` once unblocked; no `/status` comment required on the return transition.

**Example:** `/status Blocked Waiting on [person/team] to confirm [decision/access] before [specific next step]. [Independent work completed so far].`

### Canceled

- Confirm the request is withdrawn, duplicated, or superseded.
- Move to `Canceled` with `/status Canceled ...` and link the replacement ticket if one exists.

**Example:** `/status Canceled Superseded by [ticket]; no further implementation or deployment is planned.`

### Reopened/requeued as To Do

- If work is intentionally returned to `To Do`, leave `/status To Do ...` explaining why and who should pick it up next.

## Working checklist before each major transition

| Transition | Minimum evidence/check |
|---|---|
| To In Progress | Ticket read; UAT owner checked; questions identified |
| To Blocked | Blocking dependency and owner recorded; `/status` comment |
| To Code Review | Internal tests pass; PR/change evidence; `/status` comment |
| To Stakeholder Review | Actual business tester named; test kit ready; `/status` comment |
| To Awaiting CAB Approval | CAB submitted; business UAT contact and pending gates identified; release scope/window recorded; `/status` comment |
| To Ready for Release | CAB approved (if required); UAT and technical approvals complete; correct Fix Version; deployment readiness confirmed; `/status` comment |
| To Done (deployment) | Production result and smoke-test evidence; `/status` comment |
| To Done (no deployment) | No-change verification and closure basis documented; `/status` comment |
| To Canceled / To Do | Reason and next disposition documented; `/status` comment |

## Trial notes — things to adjust after using this for a few days

Add real examples below instead of changing the workflow on the fly. Review the notes together at the end of the trial.

| Date / ticket | Where the process felt wrong or incomplete | Proposed change |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

### Open questions for the trial

- Should **business UAT ownership** be a mandatory Jira field or checklist item rather than tracked solely in comments?
- For configuration-only changes, which cases need technical peer review or a separate change approver?
- Which release/CAB requirements apply to promotion records and other administrative configuration updates?
- Does the CAB process ever allow approval before UAT finishes? If so, what evidence must be completed before transitioning from `Awaiting CAB Approval` to `Ready for Release`?
- Should Production smoke testing be developer-only, business-assisted, or decided by change risk?
- Do we need a distinct **post-deployment observation period** before `Done` for high-impact integrations?

---

**Guiding principle:** Verify the actual business UAT owner at intake, give Jira release visibility early, test before handoff, distinguish *CAB submitted* from *CAB approved*, record approval explicitly, and never confuse `Done` with “deployed” unless deployment actually occurred.
