import argparse
from django.core import exceptions
from django.utils.text import capfirst


def str2bool(v):
    if isinstance(v, bool):
        return v
    if v.lower() in ('yes', 'true', 't', 'y', '1'):
        return True
    elif v.lower() in ('no', 'false', 'f', 'n', '0'):
        return False
    else:
        raise argparse.ArgumentTypeError('Boolean value expected.')


def get_input_data(stderr, field, message, default=None, skip_validation=False):
    raw_value = input(message)
    if default is not None and raw_value == '':
        raw_value = default

    if skip_validation:
        return raw_value

    try:
        val = field.clean(raw_value, None)
    except exceptions.ValidationError as e:
        stderr.write("Error: %s" % '; '.join(e.messages))
        val = None

    return val


def get_input_message(field, default=None):
    return '%s%s%s: ' % (
        capfirst(field.verbose_name),
        " (leave blank to use '%s')" % default if default is not None else '',
        ' (%s.%s)' % (
            field.remote_field.model._meta.object_name,
            field.m2m_target_field_name() if field.many_to_many else field.remote_field.field_name,
        ) if field.remote_field else '',
    )
