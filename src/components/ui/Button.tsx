import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '@/lib/utils/cn';
import { sound } from '@/lib/audio/sound-controller';

type CommonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 select-none whitespace-nowrap will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants = {
  // Stripe-style accent button
  primary:
    'bg-accent text-white hover:bg-accent-deep hover:shadow-glow active:scale-[0.98]',
  secondary:
    'bg-surface text-ink border border-line hover:border-accent hover:text-accent hover:bg-accent-soft active:scale-[0.98]',
  ghost:
    'bg-transparent text-ink-2 hover:text-accent hover:bg-accent-soft',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-[15px] px-5 py-2.5',
  lg: 'text-base px-7 py-3.5',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  CommonProps & { as?: 'button' };

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  CommonProps & { as: 'a'; href: string };

type RouterProps<E> = {
  as: E;
  to: string;
} & CommonProps & Record<string, unknown>;

export type ButtonComponentProps = ButtonProps | AnchorProps | RouterProps<any>;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonComponentProps>(
  (props, ref) => {
    const { variant = 'primary', size = 'md', className } = props as CommonProps & { className?: string };
    const styles = cn(base, variants[variant], sizes[size], className);

    if (typeof (props as any).as === 'function' || typeof (props as any).as === 'object') {
      const { as: Component, variant: _v, size: _s, className: _c, ...rest } = props as RouterProps<any>;
      return (
        <Component
          ref={ref as any}
          {...rest}
          className={styles}
          onClick={(e: ReactMouseEvent) => {
            sound.play('click');
            (rest as any).onClick?.(e);
          }}
        />
      );
    }

    if ((props as AnchorProps).as === 'a') {
      const anchorProps = props as AnchorProps;
      const { as: _as, variant: _v, size: _s, className: _c, onClick, ...rest } = anchorProps;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...rest}
          className={styles}
          onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
            sound.play('click');
            onClick?.(e);
          }}
        />
      );
    }

    const buttonProps = props as ButtonProps;
    const { as: _as, variant: _v, size: _s, className: _c, onClick, onMouseEnter, ...rest } = buttonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={rest.type ?? 'button'}
        {...rest}
        className={styles}
        onMouseEnter={(e) => {
          sound.play('hover');
          onMouseEnter?.(e);
        }}
        onClick={(e) => {
          sound.play('click');
          onClick?.(e);
        }}
      />
    );
  },
);

Button.displayName = 'Button';
