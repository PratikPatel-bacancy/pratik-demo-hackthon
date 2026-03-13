'use client';

import type { ComponentPropsWithoutRef } from 'react';

type DashboardUser = {
  id: string;
  profile_image?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

type UserCardProps = ComponentPropsWithoutRef<'div'> & {
  user: DashboardUser;
};

export function UserCard({ user, className = '', ...rest }: UserCardProps) {
  const displayName = user.name?.trim() || 'Valued member';
  const email = user.email || 'Email not provided';
  const phone = user.phone || 'Phone not provided';
  const address = user.address || 'Address not provided';
  const avatar =
    user.profile_image?.trim() ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D0D0D&color=FFFFFF&size=128`;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-950/70 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${className}`}
      {...rest}
    >
      <div className="h-32 w-full overflow-hidden bg-slate-800">
        <img
          alt={displayName}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
          src={avatar}
        />
      </div>
      <div className="space-y-2 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Profile</p>
          <h3 className="text-lg font-semibold text-white">{displayName}</h3>
        </div>
        <div className="space-y-1 text-sm text-slate-300">
          <p className="text-slate-400">{email}</p>
          <p>{phone}</p>
          <p>{address}</p>
        </div>
      </div>
    </div>
  );
}
