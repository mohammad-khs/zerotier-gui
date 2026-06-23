"use client";

import React, { FC } from "react";
import { Member } from "@/types/networkMember";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, MoreVertical, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
  onToggleAuthorization: (memberId: string, authorized: boolean) => void;
}

const MemberCard: FC<MemberCardProps> = ({
  member,
  onEdit,
  onDelete,
  onToggleAuthorization,
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const lastAuthDate = new Date(member.lastAuthorizedTime);
  const creationDate = new Date(member.creationTime);
  const isRecent = Date.now() - member.creationTime < 24 * 60 * 60 * 1000; // Last 24 hours

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header with auth status and menu */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {(member as any).name || "Unnamed Device"}
              </h3>
              {isRecent && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  New
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {(member as any).description || "No description"}
            </p>
            {/* Member ID with copy button */}
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md w-fit">
              <code className="text-xs font-mono text-muted-foreground">
                {member.id.slice(0, 10)}...
              </code>
              <button
                onClick={() => copyToClipboard(member.id, "Member ID")}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Copy full ID"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Authorization status badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              {member.authorized ? (
                <div className="flex flex-col items-end gap-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">
                    Authorized
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">
                    Pending
                  </span>
                </div>
              )}
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(member)}>
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {member.authorized ? (
                  <DropdownMenuItem
                    onClick={() => onToggleAuthorization(member.id, false)}
                    className="text-amber-600"
                  >
                    Revoke Access
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onToggleAuthorization(member.id, true)}
                    className="text-green-600"
                  >
                    Authorize
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(member.id)}
                  className="text-red-600"
                >
                  Delete Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* IP Assignments */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            IP Assignments
          </p>
          {member.ipAssignments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.ipAssignments.map((ip, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="font-mono text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {ip}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No IP assignments
            </p>
          )}
        </div>

        {/* Address and version info */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Address
            </p>
            <p className="text-sm font-mono mt-1">{member.address || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Version
            </p>
            <p className="text-sm font-mono mt-1">
              {member.vMajor}.{member.vMinor}.{member.vProto}
            </p>
          </div>
        </div>

        {/* Timeline info */}
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground/70 mb-1">Created</p>
            <p>{creationDate.toLocaleDateString()}</p>
            <p className="text-xs">{creationDate.toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="font-semibold text-foreground/70 mb-1">Last Auth</p>
            <p>{lastAuthDate.toLocaleDateString()}</p>
            <p className="text-xs">{lastAuthDate.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MemberCard;
