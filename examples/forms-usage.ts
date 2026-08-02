/**
 * Forms API — hosted forms and referral waitlists.
 *
 * Run with: npx ts-node examples/forms-usage.ts
 */
import { SmashSend, SmashsendCountryCode } from '../src';

const smashsend = new SmashSend(process.env.SMASHSEND_API_KEY || 'smashsend_xxxxxxxxxxxx');

// The form's public key — the `/f/{publicKey}` segment of its hosted URL.
const PUBLIC_KEY = 'pk_abc123';
// The form's id — used by the API-key-authenticated endpoints.
const FORM_ID = 'frm_abc123';

async function readTheForm() {
  const { form } = await smashsend.forms.getByPublicKey(PUBLIC_KEY);

  console.log(`${form.displayName} (${form.status})`);
  form.config?.fields.forEach((field) => {
    console.log(`  ${field.key} (${field.type})${field.required ? ' *' : ''}: ${field.label}`);
  });

  if (form.referral?.isEnabled) {
    console.log(`Referrals on: ${form.referral.pointsPerReferral} points per friend`);
    form.referral.tasks.forEach((task) => {
      console.log(`  task ${task.id}: ${task.label} (+${task.points}, ${task.approval})`);
    });
  }
}

async function submitServerSide() {
  const { entry } = await smashsend.forms.submit(PUBLIC_KEY, {
    email: 'jane@example.com',
    answers: {
      firstName: 'Jane',
      company: 'Acme',
    },
    // IMPORTANT for server-side submissions: without this the country is
    // resolved from the caller's IP, which here is your own server.
    countryCode: SmashsendCountryCode.ES,
    // Present when the visitor arrived through someone's invite link.
    referralCode: 'ref_xyz',
  });

  console.log(`Entry ${entry.id} (${entry.status})`);

  if (entry.status === 'PENDING') {
    console.log('Double opt-in is on — we emailed them a confirmation link.');
  }

  return entry;
}

async function driveTheReferralLoop(publicId: string) {
  const { referralStatus } = await smashsend.forms.getReferralStatus(PUBLIC_KEY, publicId);

  console.log(`#${referralStatus.position} of ${referralStatus.participantTotal}`);
  console.log(`${referralStatus.points} points, ${referralStatus.referralCount} referrals`);
  console.log(`Share: ${referralStatus.shareUrl}`);

  // Manual tasks need proof and stay PENDING until approved in the dashboard.
  const { task } = await smashsend.forms.completeTask(PUBLIC_KEY, publicId, 'task_follow_x', {
    proof: { handle: '@jane' },
  });
  console.log(`Task ${task.taskId}: ${task.status} (+${task.pointsAwarded})`);

  // "Already signed up?" — email them their personal link.
  await smashsend.forms.sendStatusLink(PUBLIC_KEY, 'jane@example.com');
}

async function readWithApiKey() {
  // Real emails and true ranks (the public-key call returns masked emails).
  const { leaderboard } = await smashsend.forms.getLeaderboard(FORM_ID, { limit: 10 });
  leaderboard.items.forEach((row) => {
    console.log(`#${row.rank} ${row.email ?? row.maskedEmail}: ${row.points} points`);
  });

  // Position lookup accepts an entry id or an email.
  const { position } = await smashsend.forms.getEntryPosition(FORM_ID, 'jane@example.com');
  console.log(`Position ${position.position} with ${position.points} points`);

  // The full points ledger for one entry, newest first.
  let cursor: string | undefined;
  do {
    const { rewards } = await smashsend.forms.listEntryRewards(FORM_ID, 'fen_123', {
      limit: 50,
      cursor,
    });

    rewards.items.forEach((reward) => {
      console.log(`${reward.type} +${reward.points} (${reward.status}) ${reward.createdAt}`);
    });

    cursor = rewards.hasMore ? (rewards.cursor ?? undefined) : undefined;
  } while (cursor);
}

async function main() {
  await readTheForm();
  const entry = await submitServerSide();
  if (entry.publicId) {
    await driveTheReferralLoop(entry.publicId);
  }
  await readWithApiKey();
}

main().catch((error) => {
  console.error('Forms example failed:', error);
  process.exit(1);
});
